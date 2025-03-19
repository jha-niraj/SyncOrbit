'use client'

import { useState } from 'react'
import ServiceSelection from './serviceselection'
import WebDevelopmentForm from './webdevelopmentform'
import VideoEditingForm from './videeditingform'


const steps = ['Service Selection', 'Project Details', 'Features', 'Timeline', 'Additional Info']

export default function BudgetEstimatorForm() {
    const [currentStep, setCurrentStep] = useState(0)
    const [selectedService, setSelectedService] = useState<'web' | 'video' | null>(null)
    const [formData, setFormData] = useState({})

    const handleServiceSelection = (service: 'web' | 'video') => {
        setSelectedService(service)
        setCurrentStep(1)
    }
    const handleNext = (data: object) => {
        setFormData({ ...formData, ...data })
        setCurrentStep(currentStep + 1)
    }
    const handlePrevious = () => {
        setCurrentStep(currentStep - 1)
    }

    const handleSubmit = (data: object) => {
        const finalData = { ...formData, ...data }
        console.log('Final form data:', finalData)
        // Here you would typically send this data to your backend
        alert('Thank you for submitting your project details. We will get back to you with an estimate soon!')
    }

    return (
        <div className="bg-white shadow-xl max-w-7xl mx-auto rounded-lg p-8">
            <div className="mb-8">
                <div className="flex justify-between items-center">
                    {steps.map((step, index) => (
                        <div key={step} className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                                }`}>
                                {index + 1}
                            </div>
                            <div className="text-xs mt-2">{step}</div>
                        </div>
                    ))}
                </div>
                <div className="h-2 bg-gray-200 rounded-full mt-4">
                    <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-in-out"
                        style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                    ></div>
                </div>
            </div>

            {currentStep === 0 && <ServiceSelection onSelect={handleServiceSelection} />}
            {selectedService === 'web' && currentStep > 0 && (
                <WebDevelopmentForm
                    step={currentStep}
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                    onSubmit={handleSubmit}
                />
            )}
            {selectedService === 'video' && currentStep > 0 && (
                <VideoEditingForm
                    step={currentStep}
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                    onSubmit={handleSubmit}
                />
            )}
        </div>
    )
}

