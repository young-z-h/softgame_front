import {Component, OnInit} from '@angular/core';
import {Run, Warning} from '../../../core/entity/entity';
import {ActivatedRoute} from '@angular/router';
import {DatePipe} from '@angular/common';
import {YxsjtjService} from '../Service/yxsjtj.service';

@Component({
  selector: 'app-yxsjtj',
  templateUrl: './yxsjtj.component.html',
  styleUrls: ['./yxsjtj.component.css']
})
export class YxsjtjComponent implements OnInit {

  // tslint:disable-next-line:variable-name
  begin: Date;
  // tslint:disable-next-line:variable-name
  end: Date;
  dateFormat = 'yyyy/MM/dd';
  value: string;
  runs: Run[];
  warnings: Warning[];

  constructor(
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private yxsjtjService: YxsjtjService
  ) {
  }

  ngOnInit() {
    this.getYxsjtj();
  }

  getYxsjtj(): void {
    // tslint:disable-next-line:variable-name
    let date_begin = '2020-04-23';
    // tslint:disable-next-line:variable-name
    let date_end = '2020-04-30';
    if (this.begin !== undefined) {
      // tslint:disable-next-line:variable-name
      date_begin = this.datePipe.transform(this.begin, 'yyyy-MM-dd');
      // tslint:disable-next-line:variable-name
      date_end = this.datePipe.transform(this.end, 'yyyy-MM-dd');
    }

    this.yxsjtjService.getRuns(date_begin, date_end)
      .subscribe((res: any) => {
        this.runs = res.data;
        const ratioNum = [];
        const time = [];
        for (const run of this.runs) {
          if (this.value === 'open') {
            ratioNum.push(run.open);
          } else if (this.value === 'warn') {
            ratioNum.push(run.warn);
          } else if (this.value === 'wait') {
            ratioNum.push(run.wait);
          } else {
            ratioNum.push(run.run);
          }
          // tslint:disable-next-line:variable-name
          const time_str = this.datePipe.transform(run.time, 'yyyy年MM月dd日');
          time.push(time_str);
        }
        // @ts-ignore
        const highCharts = require('highCharts');
        // @ts-ignore
        require('highcharts/modules/exporting')(highCharts);
        // 创建图表
        highCharts.chart('container', {
          chart: {
            type: 'column'
          },
          title: {
            text: '历史运行数据'
          },
          subtitle: {
            text: '来源： 系统统计'
          },
          xAxis: {
            categories: time,
            crosshair: true
          },
          yAxis: {
            min: 0,
            title: {
              text: '历史运行数据'
            }
          },
          tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
              '<td style="padding:0"><b>{point.y:.1f} h</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
          },
          plotOptions: {
            column: {
              pointPadding: 0.2,
              borderWidth: 0
            }
          },
          time: {
            enabled: false
          },
          series: [{
            name: '历史运行数据',
            data: ratioNum
          }]
        });
      });
  }

  getValueOpen(): void {
    this.value = 'open';
  }

  getValueRun(): void {
    this.value = 'run';
  }

  getValueWait(): void {
    this.value = 'wait';
  }

  getValueWarn(): void {
    this.value = 'warn';
  }
}