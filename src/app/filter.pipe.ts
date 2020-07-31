import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value, keys: string, term: string): unknown {
    if (!term) return value;

    return (value || []).filter(item => keys.split(',').some(key => item.hasOwnProperty(key) && new RegExp(term, 'gi').test(item[key])));
  }

}
