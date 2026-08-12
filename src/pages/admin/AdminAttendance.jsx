import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle } from '../../components/common/Card';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import { FileCheck, Download, AlertTriangle, Printer, ShieldCheck } from 'lucide-react';
import { MOCK_STUDENTS } from '../../data/mockData';

export default function AdminAttendance() {
  const [filterType, setFilterType] = useState('all');

  const attendanceAudit = MOCK_STUDENTS.map((s) => {
    const rateNum = parseInt(s.attendanceRate);
    return {
      ...s,
      isEligible: rateNum >= 75,
      rateNumber: rateNum
    };
  });

  const filteredData = attendanceAudit.filter((s) => {
    if (filterType === 'eligible') return s.isEligible;
    if (filterType === 'at_risk') return !s.isEligible;
    return true;
  });

  const columns = [
    {
      header: 'Matriculation No',
      key: 'matricNo',
      render: (val) => <span className="font-mono text-xs font-bold text-[#5A5A40]">{val}</span>
    },
    {
      header: 'Student Name',
      key: 'name',
      render: (val) => <span className="text-xs font-bold text-[#2d2d2d]">{val}</span>
    },
    {
      header: 'Cumulative Rate',
      key: 'attendanceRate',
      render: (val, row) => (
        <Badge variant={row.isEligible ? 'success' : 'danger'} size="sm">
          {val}
        </Badge>
      )
    },
    {
      header: 'Exam Docket Eligibility (NBTE)',
      key: 'isEligible',
      render: (val) => (
        <span className={`text-xs font-bold ${val ? 'text-emerald-700' : 'text-rose-600'}`}>
          {val ? '✓ Approved for Examination' : '⚠️ Below 75% Requirement'}
        </span>
      )
    },
    {
      header: 'Action',
      key: 'actions',
      render: (val, row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => alert(`Issuing official NBTE attendance warning notice to ${row.name}`)}
        >
          {row.isEligible ? 'View History' : 'Issue Warning'}
        </Button>
      )
    }
  ];

  return (
    <DashboardLayout title="Institutional Attendance Auditor">
      <div className="space-y-6">
        <div className="bg-[#fdfcfb] border border-[#e0e0d6] rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Badge variant="primary" size="sm" className="mb-1">
              NBTE 75% Compliance Audit
            </Badge>
            <h2 className="font-serif text-2xl font-bold text-[#2d2d2d]">
              Examination Docket Clearance
            </h2>
            <p className="text-xs text-[#7a7a6e] mt-1">
              Audit lecture attendance compliance across all registered ND2 students.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={() => window.print()}
              icon={Printer}
            >
              Print Docket List
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => alert('Exporting official accredited NBTE attendance summary...')}
              icon={Download}
            >
              Export Report
            </Button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'all'
                ? 'bg-[#5A5A40] text-white shadow-xs'
                : 'bg-[#f5f5f0] text-[#555544]'
            }`}
          >
            All Students ({attendanceAudit.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('eligible')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'eligible'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-[#f5f5f0] text-[#555544]'
            }`}
          >
            Eligible (&ge;75%)
          </button>
          <button
            type="button"
            onClick={() => setFilterType('at_risk')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'at_risk'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'bg-[#f5f5f0] text-[#555544]'
            }`}
          >
            At Risk (&lt;75%)
          </button>
        </div>

        <Card>
          <Table
            columns={columns}
            data={filteredData}
            keyField="id"
          />
        </Card>
      </div>
    </DashboardLayout>
  );
}
