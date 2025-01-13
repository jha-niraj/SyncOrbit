"use client"

import { Code2, Video } from 'lucide-react'

interface ServiceSelectionProps {
    onSelect: (service: 'web' | 'video') => void
}

export default function ServiceSelection({ onSelect }: ServiceSelectionProps) {
    return (
        <div className="grid md:grid-cols-2 gap-8">
            <button
                onClick={() => onSelect('web')}
                className="flex flex-col items-center p-8 border-2 border-blue-200 rounded-lg hover:border-blue-600 transition duration-300"
            >
                <Code2 className="text-5xl text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Web Development and Deployment</h3>
                <p className="text-gray-600 text-center">Custom websites, web applications, and seamless deployment solutions.</p>
            </button>
            <button
                onClick={() => onSelect('video')}
                className="flex flex-col items-center p-8 border-2 border-blue-200 rounded-lg hover:border-blue-600 transition duration-300"
            >
                <Video className="text-5xl text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Video Editing</h3>
                <p className="text-gray-600 text-center">Professional video editing services for all your content needs.</p>
            </button>
        </div>
    )
}

