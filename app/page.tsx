"use client"


import React, { useRef, useState } from 'react'
import Webcam from 'react-webcam';


type Props = {}

const HomePage = (props: Props) => {
    const webcamRef = useRef<Webcam>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    // state
    const [mirrored, setMirrored] = useState<boolean>(true);


    return (

        <div className='flex h-screen'>
            {/* Left division - webcam and Canvas  */}
            <div className='relative'>
                <div className='relative h-screen w-full'>
                    <Webcam ref={webcamRef}
                        mirrored={mirrored}
                        className='h-full w-full object-contain p-2'
                    />
                    <canvas ref={canvasRef}
                        className='absolute top-0 left-0 h-full w-full object-contain'
                    ></canvas>
                </div>
            </div>

        </div>
    )

}

export default HomePage

