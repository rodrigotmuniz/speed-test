import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const Speedometer = ({ speed }: { speed: number }) => {
  const svgRef = useRef(null)

  useEffect(() => {
    const width = 300
    const height = 150
    const radius = Math.min(width, height) / 2

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height})`)

    const scale = d3
      .scaleLinear()
      .domain([0, 200])
      .range([-Math.PI / 2, Math.PI / 2])

    // Draw arc (gauge background)
    svg
      .append('path')
      .attr(
        'd',
        d3
          .arc()
          .innerRadius(radius - 20)
          .outerRadius(radius)
          .startAngle(-Math.PI / 2)
          .endAngle(Math.PI / 2) as unknown as string,
      )
      .attr('fill', '#ddd')

    // Draw needle
    const needle = svg
      .append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', -radius + 20)
      .attr('stroke', 'red')
      .attr('stroke-width', 4)

    function updateNeedle(speed: number) {
      const angle = scale(speed)
      needle
        .transition()
        .duration(500)
        .attr('transform', `rotate(${(angle * 180) / Math.PI})`)
    }

    updateNeedle(speed)
  }, [speed])

  return <svg ref={svgRef}></svg>
}

export default Speedometer
