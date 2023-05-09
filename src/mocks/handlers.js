import { rest } from 'msw'
import document from '../Document.json';
if(localStorage.getItem('flag') != "initialized"){
  localStorage.setItem('cat_data', JSON.stringify(document));
  localStorage.setItem('flag', "initialized");
}

export const handlers = [

  rest.get('/api/get_document', (req, res, ctx) => {
        const doc = JSON.parse(localStorage.getItem('cat_data'));
        return res(ctx.json(doc));
  }),

  rest.post('/api/set_document', (req, res, ctx) => {
    const jsonData  = req.body;
    localStorage.setItem('cat_data', JSON.stringify(jsonData));
    return res(ctx.status(200));
  }),
]