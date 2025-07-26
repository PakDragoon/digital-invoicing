// import { Injectable, Logger } from '@nestjs/common';
// import { Cron, CronExpression } from '@nestjs/schedule';
// import { VisitStatus } from '@prisma/client';
// import { PrismaService } from 'src/infrastructure/orm/prisma.service';
//
// @Injectable()
// export class EndOfDayCron {
//   private readonly logger = new Logger(EndOfDayCron.name);
//   constructor(private readonly prisma: PrismaService) {}
//
//   @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { timeZone: 'America/Chicago' })
//   handleCron() {
//     this.logger.log('Running end-of-day cron job (CST/CDT)');
//     this.executeTask();
//   }
//
//   private async executeTask() {
//     try {
//       // Step 1: Mark unassigned Waiting visits as "NotAssigned"
//       const updatedUnassigned = await this.prisma.customerVisit.updateMany({
//         where: {
//           visitStatus: VisitStatus.Waiting,
//           assignedSalespersonId: null,
//         },
//         data: {
//           visitStatus: VisitStatus.NotAssigned,
//         },
//       });
//       this.logger.log(
//         `Unassigned Waiting Visits updated to NotAssigned: ${updatedUnassigned.count}`,
//       );
//
//       // Step 2: Mark remaining Waiting visits as "Inactive"
//       const updatedInactive = await this.prisma.customerVisit.updateMany({
//         where: {
//           visitStatus: VisitStatus.Waiting,
//           assignedSalespersonId: { not: null },
//         },
//         data: {
//           visitStatus: VisitStatus.Inactive,
//         },
//       });
//       this.logger.log(`Assigned Waiting Visits updated to Inactive: ${updatedInactive.count}`);
//     } catch (error) {
//       this.logger.error('Error during end-of-day customer visit update', error);
//       throw error;
//     }
//   }
// }
