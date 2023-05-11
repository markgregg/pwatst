import { AgGridReact } from 'ag-grid-react'; 
import { CellClassParams, CellStyle, ColDef, ColGroupDef, GetRowIdParams, RowClickedEvent, RowDataTransaction, ValueFormatterParams } from 'ag-grid-community';
import { useEffect, useRef, useState } from 'react';
import { emptyPosition, Position } from '../../models';
import { useDispatch } from 'react-redux';
import { isMobile } from '../../utils/misc';
import { setActive } from '../../state/activePairSlicer';
import { getPositions } from '../../services/positions';
import { registerInterest, deregisterInterest, notifyInterest } from 'pwa-synergy-client';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.min.css'; 
import './Portfolio.css';

const getRowId = (params: GetRowIdParams<Position>) => params.data.pair;

const changeCellStyle = (params: CellClassParams): CellStyle => {
  if( params.value < 0 ) {
    return { color: 'rgb(250,115,115)' };
  }
  if( params.value > 0 ) {
    return { color: 'lightgreen' };
  }
  return {};
}

const positionCellStyle = (params: CellClassParams): CellStyle => {
  if( params.value < 0 ) {
    return { color: 'rgb(250,115,115)' };
  }
  return {};
}

const nummberformatter = Intl.NumberFormat('default', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
const rateformatter = Intl.NumberFormat('default', { minimumFractionDigits: 1, maximumFractionDigits: 4 })
const percentageformatter = Intl.NumberFormat('default', { style: "percent", minimumFractionDigits: 2 })

const column = (
  field: string, 
  headerName: string, 
  filter: string, 
  mobile: number, 
  desktop: number, 
  valueFormatter?: (params: ValueFormatterParams) => any,
  cellStyle?: (params: CellClassParams) => CellStyle
): ColDef<Position> => {
  return {
    field, 
    headerName, 
    filter, 
    valueFormatter,
    cellStyle,
    sortable: true, 
    width: isMobile() ? mobile : desktop
  }
}

const rateColumn = (
  field: string, 
  headerName: string,
  cellStyle?: (params: CellClassParams) => CellStyle
): ColDef<Position> => {
  return column(
    field, 
    headerName, 
    'agNumberColumnFilter', 
    100,
    160,
    (params: ValueFormatterParams) => rateformatter.format(params.value),
    cellStyle
  )
}

const rowData = getPositions();
const pair = column('pair', 'Pair', 'agTextColumnFilter', 80, 130);
const avgPrice = rateColumn('averagePrice', 'Avg Price');
const position = column('position', 'Position', 'agNumberColumnFilter', 110, 170, (params: ValueFormatterParams) => nummberformatter.format(params.value), positionCellStyle);
const lastPrice =rateColumn('lastPrice', 'Lst Price');
const change = rateColumn('change', 'Change', changeCellStyle);
const percChange = column('percentageChange', '% Change', 'agNumberColumnFilter', 110, 170, (params: ValueFormatterParams) => percentageformatter.format(params.value), changeCellStyle);
const updates = column('updates', 'Updates', 'agNumberColumnFilter', 110, 170, (params: ValueFormatterParams) => nummberformatter.format(params.value));
const high = rateColumn('high', 'High');
const low = rateColumn('low', 'Low');

const columns = isMobile() 
? [
  pair,
  avgPrice,
  position,
  lastPrice,
  percChange,
  high,
  low
]
: [
  pair,
  avgPrice,
  position,
  lastPrice,
  change,
  percChange,
  updates,
  high,
  low
]

const Portfolio = () => {
  const dispatch = useDispatch();
  const gridRef = useRef<AgGridReact<any>>(null); 
  const [columnDefs] = useState<(ColDef<Position> | ColGroupDef<Position>)[]>(columns);

  useEffect(() => {
    const interval = setInterval( () => {
      const updates: Position[]  = [];
      const items =  Math.floor(Math.random() * 10);
      for( let i = 0; i < items; i++ ) {
        const idx = Math.floor(Math.random() * rowData.length);
        let positionAt = rowData.at(idx);
        if( positionAt ) {
          const rowData = gridRef.current?.api.getRowNode(positionAt.pair)
          if( rowData ) {
            const position: Position = {
              ...rowData.data
            }
            const base = position.averagePrice * 10000;
            const rateChng = Math.random() * (base * .0025);
            const delta = Math.floor(Math.random() * 10) > 4 ? rateChng : rateChng * -1;
            const size = (Math.floor(Math.random() * 100) * 10) *  (Math.floor(Math.random() * 6) > 2 ? -1 : 1);
            const rate = (base + delta) / 10000;
            position.updates++;
            const newAvg = (position.averagePrice + rate) / 2;
            position.change = newAvg - position.averagePrice;
            position.percentageChange = position.change / newAvg;
            position.averagePrice = newAvg;
            position.lastPrice = rate;
            if( !position.low || rate < position.low) {
              position.low = rate;
            }
            if( !position.high || rate > position.high) {
              position.high = rate;
            }
            position.position += size;
            updates.push(position);
          }
        }
      }
      if( gridRef.current ) {
        const rowDataTransaction: RowDataTransaction<Position> = {
          update: updates
        }
        gridRef.current.api.applyTransaction(rowDataTransaction);
      }
    }, 250);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const update = (topic: string, interest: string) => {
      console.log(`topic: ${topic}, interest: ${interest}`);
      const position = rowData.find(pos => pos.pair === interest);
      if( position ) {
        dispatch(setActive(position));  
      }
    }
    registerInterest("ccyPair", update);
    return () => deregisterInterest("ccyPair", update);
  }, [])

  const gridReady = () => {
    if( gridRef.current) {
      gridRef.current?.columnApi.autoSizeAllColumns();
    }
  }

  const rowClicked = (event: RowClickedEvent<Position>) => {
    dispatch(setActive(event.data ?? emptyPosition));
    if( event.data ) {
      notifyInterest("test", undefined, undefined, event.data);
    }
  }

  return (
    <div className='agGridContainer ag-theme-balham-dark'>
      <AgGridReact 
        ref={gridRef}
        rowData={rowData} // Row Data for Rows
        columnDefs={columnDefs} // Column Defs for Columns
        onGridReady={gridReady}
        getRowId={getRowId}
        onRowClicked={rowClicked}
      />
    </div>
  );
}

export default Portfolio;