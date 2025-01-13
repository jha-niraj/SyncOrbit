import { useState } from 'react'

interface FormData {
    projectType: string;
    projectSize: string;
    features: string[];
    timeline: string;
    additionalInfo: string;
}

interface WebDevelopmentFormProps {
    step: number
    onNext: (data: FormData) => void
    onPrevious: () => void
    onSubmit: (data: FormData) => void
}

export default function WebDevelopmentForm({ step, onNext, onPrevious, onSubmit }: WebDevelopmentFormProps) {
    const [formData, setFormData] = useState<FormData>({
        projectType: '',
        projectSize: '',
        features: [],
        timeline: '',
        additionalInfo: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value as string }))
    }

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target
        setFormData(prev => ({
            ...prev,
            features: checked
                ? [...prev.features, name]
                : prev.features.filter(feature => feature !== name)
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
                            <label className="block mb-2 font-medium">Project Type</label>
                            <select
                                name="projectType"
                                value={formData.projectType}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            >
                                <option value="">Select project type</option>
                                <option value="website">Website</option>
                                <option value="webapp">Web Application</option>
                                <option value="ecommerce">E-commerce</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 font-medium">Project Size</label>
                            <select
                                name="projectSize"
                                value={formData.projectSize}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            >
                                <option value="">Select project size</option>
                                <option value="small">Small (5-10 pages)</option>
                                <option value="medium">Medium (11-20 pages)</option>
                                <option value="large">Large (20+ pages)</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Features</h2>
                    <div className="space-y-2">
                        {['User Authentication', 'Payment Integration', 'CMS', 'SEO Optimization', 'Responsive Design'].map(feature => (
                            <div key={feature} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={feature}
                                    name={feature}
                                    checked={formData.features.includes(feature)}
                                    onChange={handleCheckboxChange}
                                    className="mr-2"
                                />
                                <label htmlFor={feature}>{feature}</label>
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
                            <option value="1-2 months">1-2 months</option>
                            <option value="3-4 months">3-4 months</option>
                            <option value="5-6 months">5-6 months</option>
                            <option value="6+ months">6+ months</option>
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

