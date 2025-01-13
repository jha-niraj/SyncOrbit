"use client"

import { useState } from 'react'

interface FormData {
    videoType: string;
    duration: string;
    services: string[];
    timeline: string;
    additionalInfo: string;
}

interface VideoEditingFormProps {
    step: number
    onNext: (data: FormData) => void
    onPrevious: () => void
    onSubmit: (data: FormData) => void
}

export default function VideoEditingForm({ step, onNext, onPrevious, onSubmit }: VideoEditingFormProps) {
    const [formData, setFormData] = useState<FormData>({
        videoType: '',
        duration: '',
        services: [],
        timeline: '',
        additionalInfo: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target
        setFormData(prev => ({
            ...prev,
            services: checked
                ? [...prev.services, name]
                : prev.services.filter(service => service !== name)
        }))
    }

    const handleContinue = () => {
        if (step < 4) {
            onNext(formData)
        } else {
            onSubmit(formData)
        }
    }

    return (
        <div className="space-y-6">
            {step === 1 && (
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Project Details</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block mb-2 font-medium">Video Type</label>
                            <select
                                name="videoType"
                                value={formData.videoType}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            >
                                <option value="">Select video type</option>
                                <option value="promotional">Promotional</option>
                                <option value="educational">Educational</option>
                                <option value="entertainment">Entertainment</option>
                                <option value="corporate">Corporate</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 font-medium">Video Duration</label>
                            <select
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            >
                                <option value="">Select duration</option>
                                <option value="short">Short (up to 2 minutes)</option>
                                <option value="medium">Medium (2-5 minutes)</option>
                                <option value="long">Long (5+ minutes)</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Services</h2>
                    <div className="space-y-2">
                        {['Color Correction', 'Sound Editing', 'Visual Effects', 'Animation', 'Subtitles/Captions'].map(service => (
                            <div key={service} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={service}
                                    name={service}
                                    checked={formData.services.includes(service)}
                                    onChange={handleCheckboxChange}
                                    className="mr-2"
                                />
                                <label htmlFor={service}>{service}</label>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {step === 3 && (
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Timeline</h2>
                    <div>
                        <label className="block mb-2 font-medium">Preferred Timeline</label>
                        <select
                            name="timeline"
                            value={formData.timeline}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Select timeline</option>
                            <option value="1-3 days">1-3 days</option>
                            <option value="4-7 days">4-7 days</option>
                            <option value="1-2 weeks">1-2 weeks</option>
                            <option value="2+ weeks">2+ weeks</option>
                        </select>
                    </div>
                </div>
            )}

            {step === 4 && (
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Additional Information</h2>
                    <div>
                        <label className="block mb-2 font-medium">Any other details you&apos;d like to share?</label>
                        <textarea
                            name="additionalInfo"
                            value={formData.additionalInfo}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            rows={4}
                        ></textarea>
                    </div>
                </div>
            )}

            <div className="flex justify-between mt-8">
                {step > 1 && (
                    <button
                        onClick={onPrevious}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition duration-300"
                    >
                        Previous
                    </button>
                )}
                <button
                    onClick={handleContinue}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
                >
                    {step < 4 ? 'Next' : 'Submit'}
                </button>
            </div>
        </div>
    )
}

