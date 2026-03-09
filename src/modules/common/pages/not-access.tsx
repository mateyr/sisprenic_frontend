export const NotAccess = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Not access</h1>
        <p className="text-muted-foreground mt-2">
          Contacta al administrador del sistema
        </p>
      </div>
    </div>
  );
};

export default NotAccess;
