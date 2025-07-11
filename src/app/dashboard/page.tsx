"use client";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";

function DashboardPage() {
    const router = useRouter();

    return (
        <>
            <p className="text-2xl font-bold text-center mb-4">Dashboard</p>
            <Button onPress={() => router.push("/")}>Logout</Button>
        </>
    );
}

export default DashboardPage;         