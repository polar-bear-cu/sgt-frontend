import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { checkHealth, HEALTH_SERVICES, type HealthService } from "@/api/health";

type Probe = { state: "loading" | "up" | "down"; detail: string };

function useHealthProbes() {
  const [probes, setProbes] = useState<Record<HealthService, Probe>>(
    () =>
      Object.fromEntries(
        HEALTH_SERVICES.map((s) => [s, { state: "loading", detail: "" }]),
      ) as Record<HealthService, Probe>,
  );

  useEffect(() => {
    HEALTH_SERVICES.forEach((service) => {
      checkHealth(service).then((result) => {
        const probe: Probe = result.success
          ? { state: "up", detail: `${result.data?.serviceName} @ ${result.data?.timestamp}` }
          : { state: "down", detail: `${result.error?.status} ${result.error?.message}` };
        setProbes((p) => ({ ...p, [service]: probe }));
      });
    });
  }, []);

  return probes;
}

type EchoForm = { message: string };

export default function StatusPage() {
  const probes = useHealthProbes();
  const { register, handleSubmit, reset } = useForm<EchoForm>({ defaultValues: { message: "" } });
  const [echoes, setEchoes] = useState<string[]>([]);

  return (
    <div className="flex flex-col gap-6">
      {/* Health Check */}
      <section>
        <h2 className="text-xl font-bold">Service health</h2>
        <table className="mt-2 border-collapse">
          <tbody>
            {HEALTH_SERVICES.map((service) => {
              const probe = probes[service];
              return (
                <tr key={service} className="border-b">
                  <td className="pr-4 py-1 font-mono">{service}</td>
                  <td className="pr-4 py-1">{probe.state}</td>
                  <td className="py-1 text-muted-foreground text-xs">{probe.detail}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* Form */}
      <section>
        <h2 className="text-xl font-bold">Echo form</h2>
        <form
          className="mt-2 flex gap-2"
          onSubmit={handleSubmit((data) => {
            setEchoes((e) => [data.message, ...e]);
            reset();
          })}
        >
          <input
            className="border px-2 py-1"
            placeholder="type something"
            {...register("message", { required: true })}
          />
          <Button type="submit">Add</Button>
        </form>
        <ul className="mt-2 list-disc pl-5">
          {echoes.map((echo, i) => (
            <li key={i}>{echo}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
