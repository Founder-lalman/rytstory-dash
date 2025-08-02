import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';

const WordCloud = ({ words }) => {
    const svgRef = useRef();
    const [selectedWord, setSelectedWord] = useState(null);

    useEffect(() => {
        const width = 500;
        const height = 500;

        const displayWords = selectedWord
            ? words.filter(word => word.text === selectedWord)
            : words;

        const layout = cloud()
            .size([width, height])
            .words(
                displayWords.map(d => ({
                    text: d.text,
                    size: 10 + d.value, // soft scale
                }))
            )
            .padding(5)
            .rotate(() => (Math.random() > 0.85 ? 90 : 0)) // mostly horizontal
            .font('Segoe UI')
            .fontSize(d => d.size)
            .spiral('archimedean') // oval-like layout
            .on('end', draw);

        layout.start();

        function draw(words) {
            const svg = d3.select(svgRef.current);
            svg.selectAll('*').remove();

            const colorScale = d3.scaleOrdinal([
                '#66c2a5',
                '#fc8d62',
                '#8da0cb',
                '#e78ac3',
                '#a6d854',
                '#ffd92f',
                '#e5c494',
                '#b3b3b3',
            ]);

            svg
                .attr('width', width)
                .attr('height', height)
                .append('g')
                .attr('transform', `translate(${width / 2}, ${height / 2})`)
                .selectAll('text')
                .data(words)
                .enter()
                .append('text')
                .style('font-family', 'Segoe UI, sans-serif')
                .style('fill', (d, i) => colorScale(i))
                .style('font-size', d => `${d.size}px`)
                .style('cursor', 'pointer')
                .attr('text-anchor', 'middle')
                .attr('transform', d => `translate(${d.x}, ${d.y}) rotate(${d.rotate})`)
                .text(d => d.text)
                .on('click', (event, d) => {
                    setSelectedWord(d.text);
                });
        }
    }, [words, selectedWord]);

    return (
        <div style={{ textAlign: 'center' }}>
            <svg ref={svgRef}></svg>
            {selectedWord && (
                <button onClick={() => setSelectedWord(null)} style={{ marginTop: 10 }}>
                    Show All
                </button>
            )}
        </div>
    );
};

export default WordCloud;
