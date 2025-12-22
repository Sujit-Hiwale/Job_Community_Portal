import { Briefcase, FileText, Users, TrendingUp, Target, Zap, Send, User, Building2, Mail, Phone, MessageSquare, CheckCircle } from "lucide-react";

function Services() {
  const services = [
    {
      icon: Target,
      title: "Job Matching",
      description: "Our advanced algorithm matches job seekers with the most relevant opportunities based on skills and experience.",
      color: "from-blue-500 to-cyan-500",
      iconColor: "text-blue-600"
    },
    {
      icon: FileText,
      title: "Resume Building",
      description: "Create professional resumes with our easy-to-use templates and get noticed by recruiters.",
      color: "from-purple-500 to-pink-500",
      iconColor: "text-purple-600"
    },
    {
      icon: Users,
      title: "Recruiter Tools",
      description: "Access powerful tools to manage applications, schedule interviews, and communicate with candidates.",
      color: "from-orange-500 to-red-500",
      iconColor: "text-orange-600"
    },
    {
      icon: TrendingUp,
      title: "Career Guidance",
      description: "Get expert advice on career development, interview preparation, and salary negotiation.",
      color: "from-green-500 to-teal-500",
      iconColor: "text-green-600"
    },
    {
      icon: Briefcase,
      title: "Company Branding",
      description: "Build your employer brand and attract top talent with our company profile solutions.",
      color: "from-indigo-500 to-blue-500",
      iconColor: "text-indigo-600"
    },
    {
      icon: Zap,
      title: "Fast Hiring",
      description: "Streamline your hiring process with automated screening and instant candidate notifications.",
      color: "from-yellow-500 to-orange-500",
      iconColor: "text-yellow-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <Briefcase className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">
            Our Services
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Comprehensive solutions for job seekers, recruiters, and companies to succeed in their career journey
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 text-center border border-gray-100 dark:border-gray-700">
            <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              6+
            </div>
            <div className="text-gray-600 dark:text-gray-400">Services</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 text-center border border-gray-100 dark:border-gray-700">
            <Users className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              1000+
            </div>
            <div className="text-gray-600 dark:text-gray-400">Happy Clients</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 text-center border border-gray-100 dark:border-gray-700">
            <Zap className="w-8 h-8 text-pink-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              24/7
            </div>
            <div className="text-gray-600 dark:text-gray-400">Support</div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 dark:border-gray-700 group"
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${service.color} rounded-xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <service.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* Request Service Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <Send className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Request a Service
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Fill out the form below and our team will contact you to discuss your requirements
            </p>
          </div>

          <form 
            className="grid grid-cols-1 md:grid-cols-2 gap-6" 
            onSubmit={(e) => { 
              e.preventDefault(); 
              alert('Request sent successfully! Our team will contact you soon.'); 
            }}
          >
            {/* Full Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <User className="w-4 h-4" />
                Full Name
              </label>
              <input 
                name="name" 
                required 
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Enter your full name"
              />
            </div>

            {/* Company */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <Building2 className="w-4 h-4" />
                Company (Optional)
              </label>
              <input 
                name="company" 
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Your company name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <input 
                name="email" 
                type="email" 
                required 
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="your.email@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <Phone className="w-4 h-4" />
                Phone (Optional)
              </label>
              <input 
                name="phone" 
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            {/* Message */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <MessageSquare className="w-4 h-4" />
                Message
              </label>
              <textarea 
                name="message" 
                rows={5} 
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                placeholder="Tell us about your requirements..."
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 flex gap-4">
              <button 
                type="submit" 
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 font-semibold"
              >
                <Send className="w-5 h-5" />
                Send Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Services;
