import { logAround } from 'src/app/logger/decorator/log-around';
import { TasksTemplateReqDto } from '../dtos/request';
import { InputType, Task } from 'src/app/template/entities';
import { TaskTemplateResDto } from '../dtos/response/template.dto';
import { InputTypeMapper } from './input-type.mapper';

export class TaskMapper {
  @logAround()
  static toEntities(
    dtos: TasksTemplateReqDto[],
    toUpdateParent: boolean,
  ): Task[] {
    return dtos.map((taskDto: TasksTemplateReqDto) => {
      return this.toEntity(taskDto, toUpdateParent);
    });
  }

  @logAround()
  static toEntity(taskDto: TasksTemplateReqDto, toUpdateParent: boolean): Task {
    const task = new Task();
    task.id = toUpdateParent ? taskDto.id : undefined;
    task.name = taskDto.name;
    task.order = taskDto.order;
    task.inputType = {
      id: taskDto.inputTypeId,
    } as InputType;
    task.inputTypeOptions = taskDto.inputTypeOptions;
    task.enableCamera = taskDto.enableCamera;
    task.enableComments = taskDto.enableComments;
    task.enableTrainingInfo = taskDto.enableTrainingInfo;
    task.trainingInfoOptions = taskDto.trainingInfoOptions;
    return task;
  }

  @logAround()
  static toResDto(task: Task): TaskTemplateResDto {
    return {
      id: task.id,
      name: task.name,
      order: task.order,
      inputTypeOptions: task.inputTypeOptions,
      enableCamera: task.enableCamera,
      enableComments: task.enableComments,
      enableTrainingInfo: task.enableTrainingInfo,
      trainingInfoOptions: task.trainingInfoOptions,
      inputType: InputTypeMapper.toResDto(task.inputType),
    };
  }
}
