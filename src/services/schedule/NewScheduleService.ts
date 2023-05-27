import prismaClient from "../../prisma"

interface ScheduleRequest {
    user_id: string;
    haircut_id: string;
    customer: string;
}

class NewScheduleService {
    async execute({user_id, haircut_id, customer}: ScheduleRequest) {
        if(customer === '' || haircut_id === '') {
            throw new Error('Error!');
        }

        const schedule = await prismaClient.service.create({
            data: {
                customer,
                haircut_id,
                user_id,
            }
        });

        return schedule;
    }
}

export { NewScheduleService }