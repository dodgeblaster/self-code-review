import { invokeConversation } from './back_bedrock.mjs'
import s from './back_server.mjs'

import {listFiles, openTextFileInDefaultEditor} from './back_list.mjs'
import { getRepoInfo } from './back_gitdiff.mjs'

const server = s()

server.front('./static/')

server.api('/commit', async (event) => {
   const result = await getRepoInfo()

   const prompt = `You are a senior software engineer who is very good at code reviews.

I have a JSON object that represents a code changes between 2 commits. The
updated code is being submitted for review. I want you to review this change,
and inject your comments into the updated code as js comments. Prefix them with "@seniordev: ".
I also want you to put the same comments in a list inside a comments property on the JSON object. 
What I want you to focus on is:
- is debugging code accidently here
- is there overly complicated code
- is the cyclomatic complexity too high
- does it follow best practices
- can it be simplified

Here is the JSON object representing the code change:

<json_code_change>
${JSON.stringify(result, null, 2)}
</json_code_change>

Can you respond with a new json_code_change object with your comments?
   
   
   `
const messages = [
   { role: 'user', content: [{ type: 'text', text: prompt }]},
   { role: 'assistant', content: [{ type: 'text', text: '<json_code_change_with_comments>' }]}
]

   const aiResponse = await invokeConversation(messages, 0.1, '', '</json_code_change_with_comments>')
console.log(aiResponse)

   return {
      statusCode: 200,
      body: JSON.stringify({
         diff: result, 
         result: aiResponse
      })
   }
})

server.api('/open', async (event) => {
   const result = await openTextFileInDefaultEditor(event.path)
   return {
      statusCode: 200,
      body: JSON.stringify({
         result: result
      })
   }
})

server.start()