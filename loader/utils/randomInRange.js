import React from 'react'

export default function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
}
