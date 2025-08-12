import React from 'react';

const Calendar = () => {
  const width = 250;
  const height = 165;
  const rows = 7;
  //const top_spacer = 14;
  const top_spacer = 0;
  const cell_height = (height - top_spacer) / rows;
  const label_width = 15; // Width for day labels
  const primary_color = "#D3DDE8";
  //const border = 'border-1 border-green-500';
  const border = ''

  // Set start and end dates
  // NOTE: dates need to be in UTC to work correctly
  const start_date = new Date('2025-08-01T00:00:00-05:00');
  const first_cell_date = new Date(start_date);
  first_cell_date.setDate(start_date.getDate() - start_date.getDay() + 1); // Adjust to Monday (1)
  const end_date = new Date('2025-10-13T00:00:00-05:00');
  
  // Get current date for comparison
  const current_date = new Date();
  
  // Calculate total number of days between start and end dates
  const total_days = Math.ceil((end_date - first_cell_date) / (1000 * 60 * 60 * 24)) + 1;
  const cols = Math.ceil(total_days / rows)-1;
  const month_spacers = end_date.getMonth() - start_date.getMonth();
  const month_spacers_a = end_date.getMonth() - start_date.getMonth();
  const cell_width = (width - month_spacers * 4) / cols;
  
  const renderDayLabels = () => {
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    return days.map((day, row) => (
      <text 
        key={`day-${row}`}
        x={`${label_width/2}`}
        y={`${row * cell_height + cell_height/2 + 4 + top_spacer}`}
        textAnchor="middle"
        fill="#ddd"
        fontSize="10px"
      >
        {day}
      </text>
    ));
  };

  const renderCalendarCells = () => {
    let cell_count = 0;
    const cells = [];

    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        const cell_date = new Date(first_cell_date);
        cell_date.setDate(first_cell_date.getDate() + cell_count);

        if (cell_date < start_date) {
          cell_count++;
          continue;
        }
        
        if (cell_date > end_date) {
          break;
        }
        
        const end_of_week = new Date(cell_date);
        if (cell_date.getDay() !== 0) {
          end_of_week.setDate(cell_date.getDate() + 7 - cell_date.getDay());
        }
        const month_spacers = end_of_week.getMonth() - start_date.getMonth();
        
        //const month_spacers = Array.from({length: ((end_of_week - first_cell_date) / (1000 * 60 * 60 * 24))}, (_, i) => {
        //  const d = new Date(first_cell_date);
        //  d.setDate(d.getDate() + i);
        //  return d.getDate();
        //}).filter(d => d === 1).length;

        const x = col * cell_width + label_width + month_spacers * 4;
        const y = row * cell_height + top_spacer;

        if (col === 0 && row === 0) {
          console.log(cell_date);
          console.log(x);
          console.log(y);
          console.log(cell_width);
          console.log(cell_height);
          console.log(month_spacers);
        }
        
        const day = cell_date.getDate();
        let day_text;
        if (cell_date.getMonth() === 4 && cell_date.getDate() === 23) {
          day_text = "✈️";
        } else if (cell_date.getMonth() === 5 && cell_date.getDate() === 2) {
          day_text = "🛏️";
        } else if (cell_date.getMonth() === 5 && cell_date.getDate() === 3) {
          day_text = "🏠";
        } else if (cell_date.getMonth() === 5 && cell_date.getDate() === 8) {
          day_text = "🪑";
        } else if (cell_date.getMonth() === 5 && cell_date.getDate() === 18) {
          day_text = "🚙";
        } else if (cell_date.getMonth() === 5 && cell_date.getDate() === 19) {
          day_text = "⛱️";
        } else if (cell_date.getMonth() === 5 && cell_date.getDate() === 20) {
          day_text = "🛏️";
        } else if (cell_date.getMonth() === 5 && cell_date.getDate() === 26) {
          day_text = "🚲";
        } else if (cell_date.getMonth() === 6 && cell_date.getDate() === 4) {
          day_text = "⛱️";
        } else if (cell_date.getMonth() === 7 && cell_date.getDate() === 8) {
          day_text = "👩‍💼";
        } else if (cell_date.getMonth() === 7 && cell_date.getDate() === 11) {
          day_text = "📽️";
        } else if (cell_date.getMonth() === 7 && cell_date.getDate() === 30) {
          day_text = "🏊‍♀️";
        } else if (cell_date.getMonth() === 8 && cell_date.getDate() === 1) {
          day_text = "⛱️";
        } else if (cell_date.getMonth() === 9 && cell_date.getDate() === 9) {
          day_text = "🎂";
        } else {
          day_text = day;
        }

        const color = cell_date <= current_date ? "#666666" : primary_color;
        
        cells.push(
          <g key={`cell-${cell_count}`}>
            <rect 
              x={x}
              y={y}
              width={cell_width - 2}
              height={cell_height - 2}
              fill={color}
              opacity="0.5"
              rx="2"
              ry="2"
            />
            <text 
              x={x + cell_width/2 - 1}
              y={y + cell_height/2 + 4}
              textAnchor="middle"
              fill="white"
              fontSize="12px"
              fontWeight="bold"
            >
              {day_text}
            </text>
          </g>
        );
        
        cell_count++;
      }
      
      const last_cell_date = new Date(start_date);
      last_cell_date.setDate(start_date.getDate() + cell_count - 1);
      if (last_cell_date >= end_date) {
        break;
      }
    }
    return cells;
  };

  return (
    <svg width={width + label_width} height={height} viewBox={`0 0 ${width + label_width} ${height}`} className={`${border} mb-[3px]`}>
      {renderDayLabels()}
      {renderCalendarCells()}
    </svg>
  );
};

export default Calendar;
