function getFormattedRemainigTime(remainingSeconds: number) {
  const absRemainingSeconds = Math.abs(remainingSeconds);
  return `${Math.floor(absRemainingSeconds / 60)} minutos y ${Math.floor(
    absRemainingSeconds % 60
  )} segundos`;
}

function normalizeOwnerPhone(ownerPhone: string) {
  return ownerPhone.length > 10 ? ownerPhone : ownerPhone.replace(/^0/, '593')
}

export { getFormattedRemainigTime, normalizeOwnerPhone };
