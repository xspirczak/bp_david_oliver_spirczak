import React, { useCallback, useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import "./styles/RangeSlider.css";

const MultiRangeSlider = ({ min, max, onChange }) => {
    const [minVal, setMinVal] = useState(min);
    const [maxVal, setMaxVal] = useState(max);
    const minValRef = useRef(min);
    const maxValRef = useRef(max);
    const range = useRef(null);
    const prevValues = useRef({ start: min, end: max }); // Track previous values

    // Convert value to percentage
    const getPercent = useCallback(
        (value) => Math.round(((value - min) / (max - min)) * 100),
        [min, max]
    );

    // Update range bar position
    useEffect(() => {
        const minPercent = getPercent(minVal);
        const maxPercent = getPercent(maxVal);

        if (range.current) {
            range.current.style.left = `${minPercent}%`;
            range.current.style.width = `${maxPercent - minPercent}%`;
        }

        // call onChange if values actually changed
        if (prevValues.current.start !== minVal || prevValues.current.end !== maxVal) {
            prevValues.current = { start: minVal, end: maxVal };
            onChange(prevValues.current);
        }
    }, [minVal, maxVal, getPercent, onChange]);

    return (
        <>
            <input
                type="range"
                min={min}
                max={max}
                value={minVal}
                onChange={(event) => {
                    const value = Math.min(Number(event.target.value), maxVal - 1);
                    setMinVal(value);
                    minValRef.current = value;
                }}
                className="thumb thumb--left"
                style={{ zIndex: minVal > max - 100 ? "5" : "unset" }}
            />

            <input
                type="range"
                min={min}
                max={max}
                value={maxVal}
                onChange={(event) => {
                    const value = Math.max(Number(event.target.value), minVal + 1);
                    setMaxVal(value);
                    maxValRef.current = value;
                }}
                className="thumb thumb--right"
            />

            <div className="slider pb-10">
                <div className="slider__track" />
                <div ref={range} className="slider__range" />
                <div className="slider__left-value text-custom-dark-blue">{minVal}</div>
                <div className="slider__right-value text-custom-dark-blue">{maxVal}</div>
            </div>
        </>
    );
};

MultiRangeSlider.propTypes = {
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default MultiRangeSlider;
