import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from '@eitickets/common';

export class ExpirationCompletedPublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
