import { NgbDateAdapter } from './ngb-date-adapter';
import { NgbDateStruct } from '../ngb-date-struct';
/**
 * @since 3.2.0
 */
export declare class NgbDateNativeUTCAdapter extends NgbDateAdapter<Date> {
    fromModel(date: Date): NgbDateStruct;
    toModel(date: NgbDateStruct): Date;
}
