async function handleExecuteAction(action: any, onError: any) {
  let wasUnsuccesful = false;

  try {
    await action();
  } catch (err) {
    console.log("Main error: " + err);
    wasUnsuccesful = false;
  }

  if (wasUnsuccesful) {
    try {
      await onError();
    } catch (err) {
      console.log("Falback error: " + err);
    }
  }
}

export { handleExecuteAction };
