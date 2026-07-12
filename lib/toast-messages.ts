export const toastMessages = {
  auth: {
    loginSuccess: "Login berhasil.",
    loginError: "Email atau password tidak valid.",
    registerSuccess: "Akun berhasil dibuat.",
    registerError: "Registrasi gagal. Silakan periksa data kamu.",
    logoutSuccess: "Logout berhasil.",
  },

  subject: {
    createSuccess: "Subject berhasil dibuat.",
    createError: "Gagal membuat subject.",
    updateSuccess: "Subject berhasil diperbarui.",
    updateError: "Gagal memperbarui subject.",
    deleteSuccess: "Subject berhasil dihapus.",
    deleteError: "Gagal menghapus subject.",
    archiveSuccess: "Subject berhasil diarsipkan.",
    unarchiveSuccess: "Subject berhasil diaktifkan kembali.",
    archiveError: "Gagal mengubah status subject.",
  },

  studyPlan: {
    createSuccess: "Study plan berhasil dibuat.",
    createError: "Gagal membuat study plan.",
    updateSuccess: "Study plan berhasil diperbarui.",
    updateError: "Gagal memperbarui study plan.",
    deleteSuccess: "Study plan berhasil dihapus.",
    deleteError: "Gagal menghapus study plan.",
  },

  task: {
    createSuccess: "Task berhasil dibuat.",
    createError: "Gagal membuat task.",
    updateSuccess: "Task berhasil diperbarui.",
    updateError: "Gagal memperbarui task.",
    deleteSuccess: "Task berhasil dihapus.",
    deleteError: "Gagal menghapus task.",
    statusSuccess: "Status task berhasil diperbarui.",
    statusError: "Gagal memperbarui status task.",
  },

  studySession: {
    createSuccess: "Study session berhasil dicatat.",
    createError: "Gagal mencatat study session.",
    updateSuccess: "Study session berhasil diperbarui.",
    updateError: "Gagal memperbarui study session.",
    deleteSuccess: "Study session berhasil dihapus.",
    deleteError: "Gagal menghapus study session.",
  },

  settings: {
    updateSuccess: "Profile berhasil diperbarui.",
    updateError: "Gagal memperbarui profile.",
  },

  ai: {
    generateLoading: "AI sedang membuat study plan...",
    generateSuccess: "Study plan berhasil digenerate.",
    generateError: "Gagal generate study plan.",
    invalidOutput: "AI menghasilkan format yang tidak valid.",
    saveLoading: "Menyimpan generated study plan...",
    saveSuccess: "Generated study plan berhasil disimpan.",
    saveError: "Gagal menyimpan generated study plan.",
  },

  common: {
    unexpectedError: "Terjadi kesalahan. Silakan coba kembali.",
    unauthorized: "Session berakhir. Silakan login kembali.",
  },
} as const;
