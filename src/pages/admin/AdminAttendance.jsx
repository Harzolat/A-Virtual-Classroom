import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { Download, AlertTriangle, Printer, RotateCw, CheckCircle2, XCircle } from 'lucide-react';
import { fetchAdminAttendanceAudit } from '../../services/api';

export default function AdminAttendance() {
  const [filterType, setFilterType] = useState('all');
  const [auditData, setAuditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAudit = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAdminAttendanceAudit();
      setAuditData(data);
    } catch (err) {
      console.error('Failed to load admin attendance audit:', err);
      setError(err.message || 'Failed to load institutional attendance audit');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAudit();
  }, [loadAudit]);

  const studentsList = auditData?.students || [];

  const filteredData = studentsList.filter((s) => {
    if (filterType === 'eligible') return s.isEligible;
    if (filterType === 'at_risk') return !s.isEligible;
    return true;
  });

  const columns = [
    {
      header: 'Matriculation No',
      key: 'matricNo',
      render: (val) => (
        <span className="font-mono text-xs font-bold text-[#5A5A40]">{val}</span>
      ),
    },
    {
      header: 'Student Name',
      key: 'name',
      render: (val, row) => (
        <div className="flex items-center gap-2">
          {row.avatar && (
            <img
              src={row.avatar}
              alt={val}
              className="w-6 h-6 rounded-full object-cover border border-[#e0e0d6]"
            />
          )}
          <div>
            <span className="text-xs font-bold text-[#2d2d2d] block">{val}</span>
            <span className="text-[11px] text-[#8e8e7a]">{row.department || 'Computer Science'}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Cumulative Rate',
      key: 'attendanceRate',
      render: (val, row) => (
        <Badge variant={row.isEligible ? 'success' : 'danger'} size="sm">
          {val}
        </Badge>
      ),
    },
    {
      header: 'Exam Docket Eligibility (NBTE)',
      key: 'isEligible',
      render: (val) => (
        <span
          className={`text-xs font-bold flex items-center gap-1.5 ${
            val ? 'text-emerald-700' : 'text-rose-600'
          }`}
        >
          {val ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" /> Approved for Examination
            </>
          ) : (
            <>
              <XCircle className="w-3.5 h-3.5" /> Below 75% Requirement
            </>
          )}
        </span>
      ),
    },
    {
      header: 'Action',
      key: 'actions',
      render: (val, row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            alert(
              row.isEligible
                ? `Docket clearance confirmed for ${row.name} (${row.matricNo})`
                : `Official NBTE warning notice dispatched to ${row.name} (${row.email})`
            )
          }
        >
          {row.isEligible ? 'View History' : 'Issue Warning'}
        </Button>
      ),
    },
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
              onClick={loadAudit}
              icon={RotateCw}
              disabled={loading}
            >
              Refresh
            </Button>
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
              onClick={() => alert('Exporting official accredited NBTE attendance summary report...')}
              icon={Download}
            >
              Export Report
            </Button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
            <button
              onClick={loadAudit}
              className="text-xs font-bold underline hover:no-underline text-rose-900"
            >
              Retry
            </button>
          </div>
        )}

        {/* Filter bar */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-[#5A5A40] text-white shadow-xs'
                : 'bg-[#f5f5f0] text-[#555544] hover:bg-[#eaeae0]'
            }`}
          >
            All Students ({studentsList.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('eligible')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterType === 'eligible'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-[#f5f5f0] text-[#555544] hover:bg-[#eaeae0]'
            }`}
          >
            Eligible (&ge;75%) ({studentsList.filter((s) => s.isEligible).length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('at_risk')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterType === 'at_risk'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'bg-[#f5f5f0] text-[#555544] hover:bg-[#eaeae0]'
            }`}
          >
            At Risk (&lt;75%) ({studentsList.filter((s) => !s.isEligible).length})
          </button>
        </div>

        <Card>
          {loading ? (
            <div className="p-12 text-center text-xs text-[#8e8e7a] flex flex-col items-center gap-2">
              <RotateCw className="w-5 h-5 animate-spin text-[#5A5A40]" />
              <span>Auditing student attendance data across active lectures...</span>
            </div>
          ) : (
            <Table
              columns={columns}
              data={filteredData}
              keyField="id"
            />
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
