import { useState } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';

const ResumeForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    jobTitle: '',
    yearsExp: '',
    skills: '',
    education: '',
    workExperience: [{ company: '', role: '', duration: '', description: '' }],
    projects: [],
    certifications: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (index, field, value, arrayName) => {
    const newArray = [...formData[arrayName]];
    newArray[index][field] = value;
    setFormData(prev => ({ ...prev, [arrayName]: newArray }));
  };

  const addArrayItem = (arrayName, emptyItem) => {
    setFormData(prev => ({ ...prev, [arrayName]: [...prev[arrayName], emptyItem] }));
  };

  const removeArrayItem = (index, arrayName) => {
    const newArray = [...formData[arrayName]];
    newArray.splice(index, 1);
    setFormData(prev => ({ ...prev, [arrayName]: newArray }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-8">
      
      {/* Personal Details */}
      <section>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Personal Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="john@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
            <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="+1 (555) 000-0000" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Job Title *</label>
            <input required type="text" name="jobTitle" value={formData.jobTitle} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Software Engineer" />
          </div>
        </div>
      </section>

      {/* Qualifications */}
      <section>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Qualifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience *</label>
            <input required type="number" min="0" name="yearsExp" value={formData.yearsExp} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="5" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Education *</label>
            <input required type="text" name="education" value={formData.education} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="B.S. Computer Science, University of X" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated) *</label>
            <textarea required rows="2" name="skills" value={formData.skills} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="React, Node.js, Python, Agile..."></textarea>
          </div>
        </div>
      </section>

      {/* Work Experience */}
      <section>
        <div className="flex justify-between items-center mb-4 pb-2 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Work Experience</h3>
          <button type="button" onClick={() => addArrayItem('workExperience', { company: '', role: '', duration: '', description: '' })} className="text-sm flex items-center text-blue-600 hover:text-blue-800">
            <PlusCircle size={16} className="mr-1" /> Add Job
          </button>
        </div>
        
        <div className="space-y-6">
          {formData.workExperience.map((exp, index) => (
            <div key={index} className="relative p-4 bg-gray-50 rounded-lg border border-gray-200">
              {index > 0 && (
                <button type="button" onClick={() => removeArrayItem(index, 'workExperience')} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
                  <Trash2 size={18} />
                </button>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Company</label>
                  <input required type="text" value={exp.company} onChange={(e) => handleArrayChange(index, 'company', e.target.value, 'workExperience')} className="w-full px-3 py-1.5 text-sm rounded bg-white border border-gray-300 focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Role</label>
                  <input required type="text" value={exp.role} onChange={(e) => handleArrayChange(index, 'role', e.target.value, 'workExperience')} className="w-full px-3 py-1.5 text-sm rounded bg-white border border-gray-300 focus:border-blue-500 outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Duration (e.g., Jan 2020 - Present)</label>
                  <input required type="text" value={exp.duration} onChange={(e) => handleArrayChange(index, 'duration', e.target.value, 'workExperience')} className="w-full px-3 py-1.5 text-sm rounded bg-white border border-gray-300 focus:border-blue-500 outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                  <textarea required rows="3" value={exp.description} onChange={(e) => handleArrayChange(index, 'description', e.target.value, 'workExperience')} className="w-full px-3 py-1.5 text-sm rounded bg-white border border-gray-300 focus:border-blue-500 outline-none" placeholder="Describe your achievements..."></textarea>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <button 
        type="submit" 
        disabled={loading}
        className={`w-full py-3 rounded-lg text-white font-medium text-lg transition-all ${
          loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'
        }`}
      >
        {loading ? 'Generating AI Resume...' : 'Generate ATS Resume'}
      </button>

    </form>
  );
};

export default ResumeForm;
