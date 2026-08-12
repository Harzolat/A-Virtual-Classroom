import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import { GraduationCap, Mail, Lock, User, Hash, BookOpen, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    matricNo: 'F/HD/24/3210088',
    email: '',
    department: 'Computer Science',
    program: 'National Diploma (ND II)',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login('student');
      setLoading(false);
      navigate('/student/dashboard');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-[#2d2d2d] flex flex-col justify-center items-center p-4 font-sans selection:bg-[#5A5A40] selection:text-white">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-2xl bg-[#5A5A40] flex items-center justify-center text-white shadow-xs">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-serif font-bold text-[#5A5A40]">
                ND2 Virtual
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-[#8e8e7a]">
                Academic Portal
              </p>
            </div>
          </Link>
          <h2 className="text-2xl font-serif font-bold text-[#2d2d2d] pt-2">
            ND2 Student Portal Registration
          </h2>
          <p className="text-xs text-[#7a7a6e]">
            Register your institutional profile to enroll in 2nd semester courses
          </p>
        </div>

        <Card className="p-6 md:p-8 shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="fullName"
              label="Full Name (Surname First)"
              type="text"
              placeholder="e.g. Adebayo Oluwaseun Emmanuel"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              icon={User}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="matricNo"
                label="Matric Number"
                type="text"
                value={formData.matricNo}
                onChange={(e) => setFormData({ ...formData, matricNo: e.target.value })}
                icon={Hash}
                required
              />

              <Input
                id="email"
                label="Institutional Email"
                type="email"
                placeholder="name@student.polytechnic.edu.ng"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                icon={Mail}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                id="department"
                label="Academic Department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                options={[
                  'Computer Science',
                  'Electrical & Electronic Engineering',
                  'Mechanical Engineering',
                  'Science Laboratory Technology',
                  'Accountancy',
                  'Business Administration'
                ]}
                required
              />

              <Select
                id="program"
                label="Class / Level"
                value={formData.program}
                onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                options={[
                  'National Diploma II (ND2) - Regular',
                  'National Diploma II (ND2) - Evening',
                  'Higher National Diploma II (HND2)'
                ]}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="password"
                label="Create Password"
                type="password"
                placeholder="••••••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                icon={Lock}
                required
              />

              <Input
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="••••••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                icon={Lock}
                required
              />
            </div>

            <div className="pt-2">
              <Button
                id="btn-register"
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full"
                icon={ArrowRight}
                iconPosition="right"
              >
                Complete Registration & Sign In
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-[#ecece2] text-center text-xs text-[#7a7a6e]">
            <span>Already have an active student account? </span>
            <Link to="/login" className="font-bold text-[#5A5A40] hover:underline">
              Sign In Here
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
