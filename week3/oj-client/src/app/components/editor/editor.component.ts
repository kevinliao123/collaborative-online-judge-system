import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";

declare var ace: any;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  editor: any;

  public languages: string[] = ['Java', 'Python'];
  language: string = 'Java';

  sessionId: string;
  output = '';

  defaultContent = {
    'Java': `public class Example {
    public static void main(String[] args) {
      // Type your Java code here
    }
}`,
    'C++': `#include <iostream>
using namespace std;
int main() {
  // Type your C++ code here
  return 0;
}`,
    'Python': `class Solution:
    def example():
      # Type your Python code here`
  };


  constructor(@Inject('collaboration') private collaboration,
              @Inject('data') private data,
              private route:ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.sessionId = params['id'];
      this.initEditor();
    });
  }

  initEditor() {
    this.editor = ace.edit('editor');
    this.editor.setTheme('ace/theme/eclipse');
    this.editor.$blockScrolling = Infinity;


    this.resetEditor();
    this.collaboration.init(this.editor, this.sessionId);
    this.editor.lastAppliedChange = null;

    document.getElementsByTagName('textarea')[0].focus();

    this.editor.on('change', (e) => {
      console.log('editor changes: ' + JSON.stringify(e));
      if(this.editor.lastAppliedChange != e) {
        this.collaboration.change(JSON.stringify(e))
      }
    });

    this.editor.getSession().getSelection().on('changeCursor',() => {
      let cursor = this.editor.getSession().getSelection().getCursor();
      this.collaboration.cursorMove(JSON.stringify(cursor));
    });

    this.collaboration.restoreBuffer()
  }

  setLanguage(language:string):void {
    this.language = language;
    this.resetEditor();
  }

  resetEditor():void {
    this.editor.getSession().setMode('ace/mode/' + this.language.toLowerCase());
    this.editor.insert(this.defaultContent[this.language]);
    this.output = '';
  }

  submit() {
    this.output = '';

    const userCodes = this.editor.getValue();
    //console.log(userCode);

    const codes = {
      userCodes: userCodes,
      lang: this.language.toLocaleLowerCase()
    };

    this.data.buildAndRun(codes)
      .then(res => this.output = res.text);
  }
}
