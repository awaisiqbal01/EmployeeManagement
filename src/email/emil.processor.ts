import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";

@Processor('email')
export class ProcessEmail extends WorkerHost{
    process(job: Job, token?: string): Promise<any> {
        switch (job.name) {
            case 'emailQeue':
                console.log('=====>>>>MQ JOB DATA<<<<=====')
                console.log(job.data);
                break;
        
            default:
                console.log('==========>>UNKNOWN REQUEST<<<=====');
                break;
        }
        return;
    }
    // sendEmailProcessor(job: Job) {
    //     console.log('=====>>>>MQ JOB DATA<<<<=====')
    //     console.log(job.data);
    // }

}