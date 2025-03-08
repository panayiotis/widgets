import React, {useEffect, useRef, useState} from 'react';

import * as d3 from 'd3';

export default function Chart() {
  const [data, set_data] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const fetch_data = async () => {
      try {
        const url =
          'https://widgets-eqh8mb.s3.us-east-1.amazonaws.com/training_status.json';
        const response = await fetch(url);
        const json_data = await response.json();
        console.log(json_data);
        set_data(json_data);
      } catch (error) {
        console.error('Error fetching training status:', error);
      }
    };

    fetch_data();
  }, []);

  useEffect(() => {
    if (!data) return;

    // Extract the daily training load data
    let device_id = data.recordedDevices[0].deviceId;
    let raw_training_data = data.reportData[device_id].map((entry) => ({
      date: new Date(entry.calendarDate),
      load: entry.acuteTrainingLoadDTO.dailyTrainingLoadAcute,
      min: entry.acuteTrainingLoadDTO.minTrainingLoadChronic,
      max: entry.acuteTrainingLoadDTO.maxTrainingLoadChronic,
    }));

    // Get date from 14 days ago
    const fourteen_days_ago = new Date();
    fourteen_days_ago.setDate(fourteen_days_ago.getDate() - 13);
    fourteen_days_ago.setHours(0, 0, 0, 0);

    // Create a complete 14-day range
    const full_date_range = Array.from({length: 14}, (_, i) => {
      const date = new Date(fourteen_days_ago);
      date.setDate(date.getDate() + i);
      return date;
    });

    // Map existing data to a lookup for easy access
    const training_lookup = new Map(
      raw_training_data.map((entry) => [entry.date.toDateString(), entry])
    );

    // Create data points for the full range, using null for missing days
    const training_load_data = full_date_range.map((date) => {
      const existing_data = training_lookup.get(date.toDateString());
      return {
        date,
        load: existing_data?.load || null,
        min: existing_data?.min || null,
        max: existing_data?.max || null,
      };
    });

    // Clear any existing SVG content
    d3.select(ref.current).selectAll('*').remove();

    // Set up dimensions
    const margin = {top: 20, right: 20, bottom: 20, left: 35};
    const width = 400 - margin.left - margin.right;
    const height = width / 2 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3
      .select(ref.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const x_scale = d3
      .scaleTime()
      .domain(d3.extent(training_load_data, (d) => d.date))
      .range([0, width]);

    // Find the maximum value for y scale, accounting for null values
    const valid_loads = training_load_data
      .filter((d) => d.load !== null)
      .map((d) => d.load);
    const max_y_value = valid_loads.length > 0 ? d3.max(valid_loads) : 700;

    // Calculate the min y value based on the min of the min load data points
    const valid_min_loads = training_load_data
      .filter((d) => d.min !== null)
      .map((d) => d.min);
    let min_y_value = 0;
    if (valid_min_loads.length > 0) {
      const min_of_min = d3.min(valid_min_loads);
      // Subtract 20 and round down to the nearest 10
      min_y_value = Math.floor((min_of_min - 20) / 10) * 10;
    }

    const y_scale = d3
      .scaleLinear()
      .domain([min_y_value, max_y_value])
      .range([height, 0]);

    // Create line generator that skips null values
    const line = d3
      .line()
      .defined((d) => d.load !== null)
      .x((d) => x_scale(d.date))
      .y((d) => y_scale(d.load));

    // Create area generators for min and max ranges
    const min_area = d3
      .area()
      .defined((d) => d.min !== null)
      .x((d) => x_scale(d.date))
      .y0(y_scale(min_y_value))
      .y1((d) => y_scale(d.min || min_y_value));

    const max_area = d3
      .area()
      .defined((d) => d.max !== null)
      .x((d) => x_scale(d.date))
      .y0(y_scale(min_y_value))
      .y1((d) => y_scale(d.max || min_y_value));

    // Add max area (green)
    svg
      .append('path')
      .datum(training_load_data)
      .attr('fill', '#373')
      .attr('d', max_area);

    // Add min area (set to background color)
    svg
      .append('path')
      .datum(training_load_data)
      .attr('fill', '#333')
      .attr('d', min_area);

    // Add hollow circles at data points (only for days with data)
    svg
      .selectAll('.data-point')
      .data(training_load_data.filter((d) => d.load !== null))
      .enter()
      .append('circle')
      .attr('class', 'data-point')
      .attr('cx', (d) => x_scale(d.date))
      .attr('cy', (d) => y_scale(d.load))
      .attr('r', 5)
      .attr('fill', 'none')
      .attr('stroke', '#ddd')
      .attr('stroke-width', 2);

    // Add x-axis with short day names
    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(
        d3.axisBottom(x_scale).tickFormat((d) => {
          //const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          //return days[d.getDay()];
          return '';
        })
      )
      .attr('color', '#ddd');

    // Add y-axis
    svg
      .append('g')
      .call(
        d3
          .axisLeft(y_scale)
          .tickSizeInner(-width) // Extend grid lines across the width of the chart
          .tickSizeOuter(0) // Remove outer tick marks
          .ticks(3)
      )
      .call((g) => {
        g.selectAll('.tick line')
          .attr('stroke-dasharray', '2,2') // Make grid lines dashed
          .attr('stroke-opacity', 0.3); // Make grid lines slightly transparent
        g.selectAll('.tick text').style('font-size', '20px'); // Set y-axis tick font size to 20px
      })
      .attr('color', '#ddd');

    // Add line path
    svg
      .append('path')
      .datum(training_load_data)
      .attr('fill', 'none')
      .attr('stroke', '#ddd')
      .attr('stroke-width', 2)
      .attr('d', line);
  }, [data]);

  return (
    <div className='space-y-4'>
      <svg ref={ref}></svg>
    </div>
  );
}
