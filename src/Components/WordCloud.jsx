import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';
import { usefilter } from '../context/Filtercontext';

const WordCloud = ({ words }) => {
  const { filters, setFilters } = usefilter();
  const svgRef = useRef();

  const selectedWord = filters.Words.length > 0 ? filters.Words[0].value : null;

  useEffect(() => {
    const width = 700;
    const height = 700;

    const displayWords = selectedWord ? words.filter((word) => word.text === selectedWord) : words;

    const limitedWords = (displayWords || []).slice(0, 50);

    const sizeScale = d3
      .scaleSqrt()
      .domain([d3.min(limitedWords, (d) => d.value) || 1, d3.max(limitedWords, (d) => d.value) || 100])
      .range([20, 70]);

    const layout = cloud()
      .size([width, height])
      .words(
        limitedWords.map((d) => ({
          text: d.text,
          size: sizeScale(d.value),
        })),
      )
      .padding(8)
      .rotate(() => (Math.random() > 0.85 ? 90 : 0))
      .font('Segoe UI')
      .fontSize((d) => d.size)
      .spiral('archimedean')
      .on('end', draw);

    layout.start();

    function draw(words) {
      const svg = d3.select(svgRef.current);
      svg.selectAll('*').remove();

      const colorScale = d3.scaleOrdinal(['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f', '#e5c494', '#b3b3b3']);

      svg
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`)
        .selectAll('text')
        .data(words)
        .enter()
        .append('text')
        .style('font-family', 'Segoe UI, sans-serif')
        .style('fill', (d, i) => colorScale(i))
        .style('font-size', (d) => `${d.size}px`)
        .style('cursor', 'pointer')
        .attr('text-anchor', 'middle')
        .attr('transform', (d) => `translate(${d.x}, ${d.y}) rotate(${d.rotate})`)
        .text((d) => d.text)
        .on('click', (event, d) => {
          setFilters((prev) => ({
            ...prev,
            Words: [{ value: d.text, label: d.text }],
          }));
        });
    }
  }, [words, selectedWord, setFilters]);

  return (
    <div className="text-center w-full h-[550px] overflow-hidden">
      <svg ref={svgRef} className="w-full h-full"></svg>
      {selectedWord && (
        <button
          onClick={() => setFilters((prev) => ({ ...prev, Words: [] }))}
          className="mt-2 px-4 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Show All
        </button>
      )}
    </div>
  );
};

export default WordCloud;
