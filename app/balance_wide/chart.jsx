import React, {useEffect, useRef, useState} from 'react';

import * as d3 from 'd3';

export default function Chart() {
  const [data, set_data] = useState(null);
  const ref = useRef(null);
  const container_ref = useRef(null);
  const [dimensions, set_dimensions] = useState({width: 0, height: 0});

  useEffect(() => {
    const fetch_data = async () => {
      try {
        const url = 'https://widgets-eqh8mb.s3.us-east-1.amazonaws.com/transactions_by_date.json';
        const response = await fetch(url);
        const json_data = await response.json();
        console.log(json_data);
        set_data(json_data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetch_data();
  }, []);

  useEffect(() => {
    // Function to update dimensions
    const updateDimensions = () => {
      if (container_ref.current) {
        const width = container_ref.current.clientWidth;
        set_dimensions({
          width,
          height: width / 2,
        });
      }
    };

    // Set dimensions on mount
    updateDimensions();

    // Add resize listener
    window.addEventListener('resize', updateDimensions);

    // Clean up
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!data || dimensions.width === 0) return;

    // Process transaction data
    const raw_transaction_data = data.map((entry) => ({
      date: new Date(entry.date),
      amount: entry.amount,
    }));

    // Calculate date range: from 1st of current month - 3 months
    const now = new Date();
    const start_date = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    const end_date = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of current month

    // Filter data to the specified range
    const filtered_data = raw_transaction_data.filter(
      (entry) => entry.date >= start_date && entry.date <= end_date
    );

    // Sort by date
    filtered_data.sort((a, b) => a.date - b.date);

    // Calculate rolling balance (cumulative sum)
    let running_balance = 0;
    const balance_data = filtered_data.map((entry) => {
      running_balance += entry.amount;
      return {
        date: entry.date,
        balance: running_balance,
      };
    });

    // Clear any existing SVG content
    d3.select(ref.current).selectAll('*').remove();

    // Set up dimensions
    const margin = {top: 5, right: 10, bottom: 30, left: 30};
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    // Create SVG
    const svg = d3
      .select(ref.current)
      .attr('width', '100%')
      .attr('height', height + margin.top + margin.bottom)
      .attr(
        'viewBox',
        `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`
      )
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const x_scale = d3
      .scaleTime()
      .domain([start_date, end_date])
      .range([0, width]);

    // Find the min and max values for y scale
    const balances = balance_data.map((d) => d.balance);
    const min_balance = d3.min(balances);
    const max_balance = d3.max(balances);
    
    // Add some padding to the y scale
    const y_padding = (max_balance - min_balance) * 0.1;
    const y_scale = d3
      .scaleLinear()
      .domain([min_balance - y_padding, max_balance + y_padding])
      .range([height, 0]);

    // Create line generator
    const line = d3
      .line()
      .x((d) => x_scale(d.date))
      .y((d) => y_scale(d.balance))
      .curve(d3.curveMonotoneX);

    // Add x-axis with month names
    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(
        d3.axisBottom(x_scale)
          .tickValues(d3.timeWeek.every(1).range(start_date, end_date)) // Show ticks every week
          .tickFormat((d) => {
            // Only show labels for the first week of each month
            if (d.getDate() <= 7) {
              const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                             'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              return months[d.getMonth()];
            }
            return ''; // Return empty string for other weeks
          })
      )
      .attr('color', '#eee');

    // Add y-axis
    svg
      .append('g')
      .call(
        d3
          .axisLeft(y_scale)
          .tickSizeInner(-width) // Extend grid lines across the width of the chart
          .tickSizeOuter(0) // Remove outer tick marks
          .ticks(Math.ceil((end_date - start_date) / (7 * 24 * 60 * 60 * 1000))) // One tick per week
          .tickFormat((d) => `${(d / 1000).toFixed(0)}k`)
      )
      .call((g) => {
        g.selectAll('.tick line')
          .attr('stroke-dasharray', '2,2') // Make grid lines dashed
          .attr('stroke-opacity', 0.3); // Make grid lines slightly transparent
        g.selectAll('.tick text').style('font-size', '16px'); // Set y-axis tick font size
      })
      .attr('color', '#eee');

    // Add line path
    svg
      .append('path')
      .datum(balance_data)
      .attr('fill', 'none')
      .attr('stroke', 'gold')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Add circle at the last data point
    if (balance_data.length > 0) {
      const last_point = balance_data[balance_data.length - 1];
      svg
        .append('circle')
        .attr('cx', x_scale(last_point.date))
        .attr('cy', y_scale(last_point.balance))
        .attr('r', 2)
        .attr('fill', 'gold');

      // Add text with the balance value
      svg
        .append('text')
        .attr('x', x_scale(last_point.date) - 10)
        .attr('y', y_scale(last_point.balance) - 10)
        .attr('fill', 'coral')
        .attr('font-size', '14px')
        .attr('font-family', 'monospace')
        .text(`$${Math.round(last_point.balance)}`);
    }
  }, [data, dimensions]);

  return (
    <div className='w-full' ref={container_ref}>
      <svg ref={ref}></svg>
    </div>
  );
}
