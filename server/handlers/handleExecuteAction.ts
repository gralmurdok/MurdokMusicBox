async function handleExecuteAction(
  action: any,
  onError: any,
  lastFallback?: any
) {
  let wasUnsuccesful = false;

  try {
    await action();
  } catch (err) {
    console.log("Main error: " + err);
    wasUnsuccesful = true;
  }

  if (wasUnsuccesful) {
    try {
      await onError();
    } catch (err) {
      if (lastFallback) {
        await lastFallback();
      }
      console.log("Falback error: " + err);
    }
  }
}

export { handleExecuteAction };
