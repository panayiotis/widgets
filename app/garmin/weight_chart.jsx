import React, {useEffect, useRef, useState} from 'react';

import * as d3 from 'd3';

export default function Chart() {
  const [data, set_data] = useState(null);
  const chart_ref = useRef(null);

  useEffect(() => {
    const fetch_data = async () => {
      try {
        const url =
          'https://widgets-eqh8mb.s3.us-east-1.amazonaws.com/weight.json';
        const response = await fetch(url);
        const json_data = await response.json();
        console.log(json_data);
        set_data(json_data);
      } catch (error) {
        console.error('Error fetching weight data:', error);
      }
    };

    fetch_data();
  }, []);

  useEffect(() => {
    if (!data) return;

    // Extract weight data from dailyWeightSummaries
    let weight_data = data.dailyWeightSummaries
      .map((entry) => ({
        date: new Date(entry.summaryDate),
        weight: entry.latestWeight.weight / 1000, // Convert from grams to kg
      }))
      .sort((a, b) => a.date - b.date); // Sort chronologically

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
    const weight_lookup = new Map(
      weight_data.map((entry) => [entry.date.toDateString(), entry])
    );

    // Create data points for the full range, using null for missing days
    const complete_weight_data = full_date_range.map((date) => ({
      date,
      weight: weight_lookup.get(date.toDateString())?.weight || null,
    }));

    // Use the complete data set for rendering
    weight_data = complete_weight_data;

    // Clear any existing SVG content
    d3.select(chart_ref.current).selectAll('*').remove();

    // Set up dimensions
    const margin = {top: 20, right: 20, bottom: 20, left: 35};
    const width = 400 - margin.left - margin.right;
    const height = width / 2 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3
      .select(chart_ref.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const x_scale = d3
      .scaleTime()
      .domain(d3.extent(weight_data, (d) => d.date))
      .range([0, width])
      .nice();

    const y_scale = d3.scaleLinear().domain([90, 95]).range([height, 0]);

    // Create line generator that skips null values
    const line = d3
      .line()
      .defined((d) => d.weight !== null)
      .x((d) => x_scale(d.date))
      .y((d) => y_scale(d.weight));

    // Add x-axis with short day names
    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(
        d3.axisBottom(x_scale).tickFormat(() => '') // Empty string removes the labels
      )
      .attr('color', '#ddd');

    // Add y-axis with grid lines, labels, and kg text
    svg
      .append('g')
      .attr('class', 'y-axis')
      .call(
        d3
          .axisLeft(y_scale)
          .tickSizeInner(-width) // Extend grid lines across the width of the chart
          .tickSizeOuter(0) // Remove outer tick marks
          .ticks(3) // Only show 3 ticks
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
      .datum(weight_data)
      .attr('fill', 'none')
      .attr('stroke', '#ddd')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Add hollow circles at data points, only for non-null values
    svg
      .selectAll('.data_point')
      .data(weight_data.filter((d) => d.weight !== null))
      .enter()
      .append('circle')
      .attr('class', 'data_point')
      .attr('cx', (d) => x_scale(d.date))
      .attr('cy', (d) => y_scale(d.weight))
      .attr('r', 5)
      .attr('fill', 'none')
      .attr('stroke', '#ddd')
      .attr('stroke-width', 2);
  }, [data]);

  return (
    <div className='space-y-4'>
      <svg ref={chart_ref}></svg>
    </div>
  );
}
