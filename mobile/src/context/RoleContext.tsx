import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';

export type UserRole = 'student' | 'teacher';

interface RoleContextType {
  role: UserRole;
  isTeacher: boolean;
  isPinModalOpen: boolean;
  pendingPath: string | null;
  lockStudentMode: () => void;
  openTeacherPinModal: (targetPath?: string) => void;
  closePinModal: () => void;
  verifyAndUnlockTeacher: (pin: string) => Promise<boolean>;
}

const STORAGE_KEY_ROLE = 'bhashagyan_active_role';
const DEFAULT_TEACHER_PIN = '1234';

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('student');
  const [isPinModalOpen, setIsPinModalOpen] = useState<boolean>(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  useEffect(() => {
    // Default to student mode on initial app launch for safety on shared tablets
    const savedRole = localStorage.getItem(STORAGE_KEY_ROLE) as UserRole;
    if (savedRole === 'teacher') {
      // Verify if active teacher profile exists
      const activeProfile = authService.getActiveProfile();
      if (activeProfile) {
        setRole('teacher');
      } else {
        setRole('student');
        localStorage.setItem(STORAGE_KEY_ROLE, 'student');
      }
    } else {
      setRole('student');
      localStorage.setItem(STORAGE_KEY_ROLE, 'student');
    }
  }, []);

  const lockStudentMode = () => {
    setRole('student');
    localStorage.setItem(STORAGE_KEY_ROLE, 'student');
    setIsPinModalOpen(false);
    setPendingPath(null);
  };

  const openTeacherPinModal = (targetPath?: string) => {
    if (targetPath) {
      setPendingPath(targetPath);
    }
    setIsPinModalOpen(true);
  };

  const closePinModal = () => {
    setIsPinModalOpen(false);
    setPendingPath(null);
  };

  const verifyAndUnlockTeacher = async (pin: string): Promise<boolean> => {
    const activeProfile = authService.getActiveProfile();
    let isValid = false;

    if (activeProfile) {
      isValid = await authService.verifyPin(activeProfile.id, pin);
    }

    // Fallback default PIN '1234' for demo / initial setup
    if (!isValid && pin === DEFAULT_TEACHER_PIN) {
      isValid = true;
    }

    if (isValid) {
      setRole('teacher');
      localStorage.setItem(STORAGE_KEY_ROLE, 'teacher');
      setIsPinModalOpen(false);
      return true;
    }

    return false;
  };

  return (
    <RoleContext.Provider
      value={{
        role,
        isTeacher: role === 'teacher',
        isPinModalOpen,
        pendingPath,
        lockStudentMode,
        openTeacherPinModal,
        closePinModal,
        verifyAndUnlockTeacher,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
