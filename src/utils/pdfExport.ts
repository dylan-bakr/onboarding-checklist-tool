import jsPDF, { AcroFormCheckBox } from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { MasterTask } from '../data/masterList'
import type { TaskAssignment, EmployeeInfo } from '../store/appStore'

const TIMING_ORDER = ['Day 1', 'Week 1', '30 Days', '60 Days', 'Exclude']

const CHECKBOX_SIZE = 9

const TIMING_COLORS: Record<string, [number, number, number]> = {
  'Day 1': [0, 120, 212],
  'Week 1': [80, 189, 255],
  '30 Days': [116, 191, 96],
  '60 Days': [255, 161, 0],
  Exclude: [180, 180, 180],
}

function formatDate(d: string): string {
  if (!d) return '—'
  const [y, m, day] = d.split('-')
  return `${m}/${day}/${y}`
}

export async function generatePDF(
  tasks: MasterTask[],
  assignments: TaskAssignment[],
  employeeInfo: EmployeeInfo,
): Promise<void> {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' })

  const assignmentMap = new Map(assignments.map((a) => [a.taskNum, a]))

  const includedRows = tasks
    .map((task) => ({
      task,
      assignment: assignmentMap.get(task.taskNum) ?? {
        taskNum: task.taskNum,
        customTiming: task.defaultTiming,
        included: task.defaultTiming !== 'Exclude',
      },
    }))
    .filter((r) => r.assignment.included)
    .sort(
      (a, b) =>
        TIMING_ORDER.indexOf(a.assignment.customTiming) -
        TIMING_ORDER.indexOf(b.assignment.customTiming),
    )

  const primaryColor: [number, number, number] = [34, 43, 54]
  const accentColor: [number, number, number] = [0, 120, 212]

  // Header
  doc.setFillColor(...primaryColor)
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 60, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('Onboarding Checklist', 40, 35)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text(
    `Generated: ${new Date().toLocaleDateString()}`,
    doc.internal.pageSize.getWidth() - 40,
    35,
    { align: 'right' },
  )

  // Employee info
  doc.setTextColor(...primaryColor)
  doc.setFontSize(10)
  const startY = 80

  doc.setFont('helvetica', 'bold')
  doc.text('Employee Name:', 40, startY)
  doc.setFont('helvetica', 'normal')
  doc.text(employeeInfo.name || '—', 160, startY)

  doc.setFont('helvetica', 'bold')
  doc.text('Supervisor:', 40, startY + 16)
  doc.setFont('helvetica', 'normal')
  doc.text(employeeInfo.supervisor || '—', 160, startY + 16)

  doc.setFont('helvetica', 'bold')
  doc.text('Start Date:', 350, startY)
  doc.setFont('helvetica', 'normal')
  doc.text(formatDate(employeeInfo.startDate), 470, startY)

  doc.setFont('helvetica', 'bold')
  doc.text('Peer Guide:', 350, startY + 16)
  doc.setFont('helvetica', 'normal')
  doc.text(employeeInfo.peerGuide || '—', 470, startY + 16)

  if (employeeInfo.title) {
    doc.setFont('helvetica', 'bold')
    doc.text('Title:', 40, startY + 32)
    doc.setFont('helvetica', 'normal')
    doc.text(employeeInfo.title, 160, startY + 32)
  }

  // Table
  const tableStartY = startY + (employeeInfo.title ? 52 : 36)

  const whoHowLinks = includedRows.map(({ task }) => task.whoHow.link)

  autoTable(doc, {
    startY: tableStartY,
    head: [['Status', '#', 'Onboarding Task', 'Why / Goal', 'Who / How', 'Assigned Timing']],
    body: includedRows.map(({ task, assignment }) => [
      '',
      task.taskNum.toString(),
      task.task,
      task.whyGoal,
      task.whoHow.text,
      assignment.customTiming,
    ]),
    styles: {
      fontSize: 8,
      cellPadding: 5,
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
    },
    columnStyles: {
      0: { cellWidth: 50, halign: 'center' },
      1: { cellWidth: 25, halign: 'center' },
      2: { cellWidth: 160 },
      3: { cellWidth: 170 },
      4: { cellWidth: 100 },
      5: { cellWidth: 70, halign: 'center' },
    },
    alternateRowStyles: {
      fillColor: [244, 244, 244],
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 4 && whoHowLinks[data.row.index]) {
        data.cell.styles.textColor = accentColor
      }
    },
    didDrawCell: (data) => {
      // Add interactive checkbox in the first column of body rows
      if (data.section === 'body' && data.column.index === 0) {
        const x = data.cell.x + (data.cell.width - CHECKBOX_SIZE) / 2
        const y = data.cell.y + (data.cell.height - CHECKBOX_SIZE) / 2
        const cb = new AcroFormCheckBox()
        cb.fieldName = `task_done_${data.row.index}`
        cb.x = x
        cb.y = y
        cb.width = CHECKBOX_SIZE
        cb.height = CHECKBOX_SIZE
        cb.value = 'Off'
        cb.appearanceState = 'Off'
        doc.addField(cb)
      }
      // Color timing badge in last column
      if (data.section === 'body' && data.column.index === 5) {
        const timing = data.cell.raw as string
        const color = TIMING_COLORS[timing] ?? [180, 180, 180]
        const x = data.cell.x + 4
        const y = data.cell.y + 3
        const w = data.cell.width - 8
        const h = data.cell.height - 6
        doc.setFillColor(...color)
        doc.roundedRect(x, y, w, h, 3, 3, 'F')
        doc.setTextColor(
          timing === 'Week 1' ? 34 : 255,
          timing === 'Week 1' ? 43 : 255,
          timing === 'Week 1' ? 54 : 255,
        )
        doc.setFontSize(7)
        doc.text(timing, x + w / 2, y + h / 2 + 2.5, { align: 'center' })
      }
      // Add clickable link annotation for Who / How cells
      if (data.section === 'body' && data.column.index === 4) {
        const rawLink = whoHowLinks[data.row.index]
        if (rawLink) {
          const url = rawLink.startsWith('http')
            ? rawLink
            : 'file:///' + rawLink.replace(/\\/g, '/')
          doc.link(data.cell.x, data.cell.y, data.cell.width, data.cell.height, { url })
        }
      }
    },
    margin: { left: 40, right: 40 },
  })

  // Footer on each page
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFillColor(...primaryColor)
    const pageH = doc.internal.pageSize.getHeight()
    const pageW = doc.internal.pageSize.getWidth()
    doc.rect(0, pageH - 24, pageW, 24, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(7)
    doc.text(`Page ${i} of ${pageCount}`, pageW / 2, pageH - 9, { align: 'center' })
    doc.setTextColor(...accentColor)
    doc.text('Milliman Onboarding Checklist Tool', 40, pageH - 9)
  }

  const filename = `onboarding-${(employeeInfo.name || 'employee').replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(filename)
}

export function exportFeedbackCSV(
  entries: { date: string; jobCode: string; taskNum: number; timing: string }[],
): void {
  const header = 'Date,Job Code,Task Num,Timing\n'
  const rows = entries.map((e) => `${e.date},${e.jobCode},${e.taskNum},${e.timing}`).join('\n')
  const blob = new Blob([header + rows], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `feedback-db-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
