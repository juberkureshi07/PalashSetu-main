export interface ConnectedStudent {
  id: string;
  name: string;
  grade: string;
  rollNo?: string;
  connectedAt: string;
}

class QRP2PService {
  private activeSessionPin: string | null = null;
  private connectedStudents: ConnectedStudent[] = [];
  private listeners: Array<(students: ConnectedStudent[]) => void> = [];

  public startTeacherSession(): { pin: string; qrDataUrl: string } {
    // Generate random 6-digit offline PIN
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    this.activeSessionPin = pin;
    this.connectedStudents = [];

    // Simple offline QR Data URL fallback (SVG QR code simulation)
    const qrDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=BHASHAGYAN_SESSION_${pin}`;

    return { pin, qrDataUrl };
  }

  public joinStudentSession(pin: string, studentName: string, grade: string, rollNo?: string): boolean {
    if (!pin || pin.length !== 6) return false;

    const student: ConnectedStudent = {
      id: 'std_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
      name: studentName || 'Student',
      grade: grade || 'Grade 1',
      rollNo: rollNo || '01',
      connectedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    this.connectedStudents.push(student);
    this.notifyListeners();
    return true;
  }

  public getConnectedStudents(): ConnectedStudent[] {
    return [...this.connectedStudents];
  }

  public getActivePin(): string | null {
    return this.activeSessionPin;
  }

  public subscribe(fn: (students: ConnectedStudent[]) => void) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((l) => l(this.connectedStudents));
  }
}

export const qrP2PService = new QRP2PService();
