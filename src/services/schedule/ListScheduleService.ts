import prismaClient from "../../prisma";

interface ScheduleRequest {
    user_id: string;
}

class ListScheduleService {
    async execute({user_id}: ScheduleRequest) {
        const schedule = await prismaClient.service.findMany({
            where: {
                user_id: user_id,
            },
            select: {
                id: true,
                customer: true,
                haircut: true,
            }
        });

        return schedule;
    }
}

export { ListScheduleService }