type GuestGreetingProps = {
  greeting: string;
  name: string;
};

export function GuestGreeting({ greeting, name }: GuestGreetingProps) {
  return (
    <div className="rounded-full border border-rose-200 bg-white/70 px-5 py-2 text-sm font-medium text-rose-900 shadow-sm shadow-rose-100/70 backdrop-blur">
      {greeting} <span className="font-semibold">{name}</span>
    </div>
  );
}
