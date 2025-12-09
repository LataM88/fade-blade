import { barber as barberData } from "@/app/data/barber";
import BarberProfile from "@/app/components/barbers/BarberProfile";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function BarberPage(props: Props) {
    const params = await props.params;
    console.log('BarberPage params:', params);
    const barber = barberData.find((b) => b.id === params.id);
    if (!barber) {
        return <div>Barber not found</div>;
    }
    return <BarberProfile barber={barber} />;
}
