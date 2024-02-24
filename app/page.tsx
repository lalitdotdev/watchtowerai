"use client"


import { ModeToggle } from '@/components/Theme-toggle';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/Separator';
import { Camera, Divide, FlipHorizontal, MoonIcon, PersonStanding, SunIcon, Video, Volume2 } from 'lucide-react';

import React, { useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam';
import { Hourglass, Rings } from 'react-loader-spinner';
import { toast } from 'sonner';
import { base64toBlob, formatDate } from '@/lib/utils';
import { beep } from '@/lib/helpers/audio';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';
import { Slider } from '@/components/ui/Slider';
import SocialMediaLinks from '@/components/social-links';
import { Meteors } from '@/components/ui/Meteors';

import cocossd, { load } from '@tensorflow-models/coco-ssd'
import "@tensorflow/tfjs-backend-cpu"
import "@tensorflow/tfjs-backend-webgl"
import { DetectedObject, ObjectDetection } from '@tensorflow-models/coco-ssd';
type Props = {}

let interval: any = null;
let stopTimeout: any = null;
const HomePage = (props: Props) => {
    const webcamRef = useRef<Webcam>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    // states
    const [mirrored, setMirrored] = useState<boolean>(true);
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [autoRecordEnabled, setAutoRecordEnabled] = useState<boolean>(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [volume, setVolume] = useState(0.8);
    const [loading, setLoading] = useState(false);
    const [model, setModel] = useState<ObjectDetection>();

    useEffect(() => {
        setLoading(true);
        initModel();
    }, [])

    // loads model
    // set it in a state varaible
    async function initModel() {
        const loadedModel: ObjectDetection = await load({
            base: 'mobilenet_v2'
        });
        setModel(loadedModel);
    }

    useEffect(() => {
        if (model) {
            setLoading(false);
        }
    }, [model])

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
            <div className='flex flex-row flex-1  dark:bg-gray-900'>
                {/* Top Part */}
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
                    {/* Bottom part */}
                    <div className='flex flex-col gap-2'>
                        <Separator className='my-2' />

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant={'outline'} size={'icon'}>
                                    <Volume2 />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                                <Slider
                                    max={1}
                                    min={0}
                                    step={0.2}
                                    defaultValue={[volume]}
                                    onValueCommit={(val) => {
                                        setVolume(val[0]);
                                        beep(val[0]);
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                <div className='h-full flex-1 py-4 px-4 overflow-y-scroll'>
                    <RenderFeatureHighlightsSection />
                </div>
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

    function userPromptRecord() {
        if (!webcamRef.current) {
            toast('Camera is not found. Please refresh.')
        }

        if (mediaRecorderRef.current?.state == 'recording') {
            // check if recording
            // then stop recording
            // and save to downloads
            mediaRecorderRef.current.requestData();
            clearTimeout(stopTimeout);
            mediaRecorderRef.current.stop();
            toast('Recording saved to downloads');

        } else {
            // if not recording
            // start recording
            startRecording(false);
        }
    }
    function startRecording(doBeep: boolean) {
        if (webcamRef.current && mediaRecorderRef.current?.state !== 'recording') {
            mediaRecorderRef.current?.start();
            doBeep && beep(volume);

            stopTimeout = setTimeout(() => {
                if (mediaRecorderRef.current?.state === 'recording') {
                    mediaRecorderRef.current.requestData();
                    mediaRecorderRef.current.stop();
                }

            }, 30000);
        }
    }

    function toggleAutoRecord() { }

    function RenderFeatureHighlightsSection() {
        return <div className="text-xs text-muted-foreground relative items-center justify-center overflow-hidden rounded-md ">
            <div className="w-full absolute inset-0 h-full ">
                <Meteors number={20} />
            </div>
            <h1 className="md:text-2xl font-bold relative z-20 ">
                WatchTower
                {/* ai text in green */}
                <span className="text-cyan-300"> AI</span>

            </h1>

            <Separator className='m-4' />

            <ul className="space-y-4">
                <li>
                    <strong>Dark Mode/Sys Theme 🌗</strong>
                    <p>Toggle between dark mode and system theme.</p>
                    <Button className="my-2 h-6 w-6" variant={"outline"} size={"icon"}>
                        <SunIcon size={14} />
                    </Button>{" "}
                    /{" "}
                    <Button className="my-2 h-6 w-6" variant={"outline"} size={"icon"}>
                        <MoonIcon size={14} />
                    </Button>
                </li>
                <li>
                    <strong>Horizontal Flip ↔️</strong>
                    <p>Adjust horizontal orientation.</p>
                    <Button className='h-6 w-6 my-2'
                        variant={'outline'} size={'icon'}
                        onClick={() => {
                            setMirrored((prev) => !prev)
                        }}
                    ><FlipHorizontal size={14} /></Button>
                </li>
                <Separator />
                <li>
                    <strong>Take Pictures 📸</strong>
                    <p>Capture snapshots at any moment from the video feed.</p>
                    <Button
                        className='h-6 w-6 my-2'
                        variant={'outline'} size={'icon'}
                        onClick={userPromptScreenshot}
                    >
                        <Camera size={14} />
                    </Button>
                </li>
                <li>
                    <strong>Manual Video Recording 📽️</strong>
                    <p>Manually record video clips as needed.</p>
                    <Button className='h-6 w-6 my-2'
                        variant={isRecording ? 'destructive' : 'outline'} size={'icon'}
                        onClick={userPromptRecord}
                    >
                        <Video size={14} />
                    </Button>
                </li>
                <Separator />
                <li>
                    <strong>Enable/Disable Auto Record 🚫</strong>
                    <p>
                        Option to enable/disable automatic video recording whenever
                        required.
                    </p>
                    <Button className='h-6 w-6 my-2'
                        variant={autoRecordEnabled ? 'destructive' : 'outline'}
                        size={'icon'}
                        onClick={toggleAutoRecord}
                    >
                        {autoRecordEnabled ? <Rings color='white' height={30} /> : <PersonStanding size={14} />}

                    </Button>
                </li>

                <li>
                    <strong>Volume Slider 🔊</strong>
                    <p>Adjust the volume level of the notifications.</p>
                </li>
                <li>
                    <strong>Camera Feed Highlighting 🎨</strong>
                    <p>
                        Highlights persons in{" "}
                        <span style={{ color: "#FF0F0F" }}>red</span> and other objects in{" "}
                        <span style={{ color: "#00B612" }}>green</span>.
                    </p>
                </li>
                <Separator />
                <li className="space-y-4">
                    <strong>Share your thoughts 💬 </strong>
                    <SocialMediaLinks />
                    <br />
                    <br />
                    <br />
                </li>
            </ul>
        </div>
    }

}

export default HomePage

