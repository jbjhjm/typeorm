import { EntitySubscriberInterface, EventSubscriber, UpdateEvent } from "../../../../../src";
import { Category } from '../entity/Category';

@EventSubscriber()
export class MockSubscriber implements EntitySubscriberInterface {
	calledData: any[] = [];
	count = 0;	
	reset() {
		this.calledData = [];
		this.count = 0;
	}	
	listenTo() {
		return Category;
	}	

	afterUpdate(event: UpdateEvent<any>): void {
		this.count++;
	    this.calledData.push(event.queryRunner.data);
	}
}
