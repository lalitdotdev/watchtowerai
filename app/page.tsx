"use client"


import { ModeToggle } from '@/components/Theme-toggle';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/Separator';
import { Camera, FlipHorizontal, PersonStanding, Video } from 'lucide-react';
import React, { useRef, useState } from 'react'
import Webcam from 'react-webcam';
import { Rings } from 'react-loader-spinner';
import { toast } from 'sonner';
import { base64toBlob, formatDate } from '@/lib/utils';

type Props = {}

const HomePage = (props: Props) => {
    const webcamRef = useRef<Webcam>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    // state
    const [mirrored, setMirrored] = useState<boolean>(true);
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [autoRecordEnabled, setAutoRecordEnabled] = useState<boolean>(false)


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
            {/* Righ division - container for button panel and wiki secion  */}
            <div className='flex flex-row flex-1'>
                <div className='border-primary/5 border-2 max-w-xs flex flex-col gap-2 justify-between shadow-md rounded-md p-4'>
                    {/* top secion  */}
                    <div className='flex flex-col gap-2'>
                        <ModeToggle />
                        <Button
                            variant={'outline'} size={'icon'}
                            onClick={() => {
                                setMirrored((prev) => !prev)
                            }}
                        ><FlipHorizontal /></Button>

                        <Separator className='my-2' />
                    </div>
                </div>
            </div>

            {/* Panel - middle part */}
            <div className='flex flex-col gap-2'>
                <Separator className='my-2' />
                <Button
                    variant={'outline'} size={'icon'}
                    onClick={userPromptScreenshot}
                >
                    <Camera />
                </Button>
                <Button
                    variant={isRecording ? 'destructive' : 'outline'} size={'icon'}
                    onClick={userPromptRecord}
                >
                    <Video />
                </Button>
                <Separator className='my-2' />
                <Button
                    variant={autoRecordEnabled ? 'destructive' : 'outline'}
                    size={'icon'}
                    onClick={toggleAutoRecord}
                >
                    {autoRecordEnabled ? <Rings color='white' height={45} /> : <PersonStanding />}

                </Button>
            </div>
        </div>

    )

    // handlers here

    function userPromptScreenshot() {
        // take picture
        if (!webcamRef.current) {
            toast('Camera not found. Please refresh');
        } else {
            const imgSrc = webcamRef.current.getScreenshot();
            console.log(imgSrc);
            const blob = base64toBlob(imgSrc);

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${formatDate(new Date())}.png`
            a.click();
        }
    }

    function userPromptRecord() { }

    function toggleAutoRecord() { }

}

export default HomePage

