# Branch Naming Practices

(https://gist.github.com/karmenatwork/e0dbe33e1c553e1a998839737c8c799a)

We have two branches main and staging; no direct modifications are made to these.

- **main**: contains code that's currently run in production.
- **staging**: contains code for the upcoming release to production. Deployed to cloud for testing, and is the branch where all development code is merged into.
- **develop**: where development code is pushed, and is the branch where all feature branches are merged into.
The main branch is considered ***origin/develop*** and it is the main branch where the source code of HEAD always reflects a state with the latest delivered development changes for the next release. As a developer, you will you be branching and merging from staging.

Consider ***origin/main*** to always represent the latest code deployed to production. During day to day development, the main branch will not be interacted with.

## Branch Naming Convention

We branch out from the latest development branch; and branches are named in this pattern:

    <branch-author>/<branch-type>/<branch-name>
  
### branch-author  
    
    <autor name or initial> is for maintaining a point-of-contact context.

easily to group/search using Git's pattern matching options.

`git branch --list 'jakobi/feature/*'. `

### branch-type

Depending on the type of code you will be working on, we use different branch names with the following convention:

#### Quick Sum

<table>
  <thead>
    <tr>
      <th>Instance</th>
      <th>Branch</th>
      <th>Description, Instructions, Notes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Production</td>
      <td>main</td>
      <td>Accepts merges from Staging and Hotfixes</td>
    </tr>
     <tr>
      <td>Staging</td>
      <td>staging</td>
      <td>Accepts merges from Develop</td>
    </tr>
    <tr>
      <td>Develop</td>
      <td>developing</td>
      <td>Accepts merges from Features/Issues, Bugfixes and Hotfixes</td>
    </tr>
    <tr>
      <td>Features/Issues</td>
      <td>feature/*</td>
      <td>Always branch off HEAD of Staging|Develop </td>
    </tr>
    <tr>
      <td>Bugfixes </td>
      <td>fix/*</td>
      <td>Always branch off  Staging|Develop </td>
    </tr>
    <tr>
      <td>Hotfix</td>
      <td>hotfix/*</td>
      <td>Always branch off main </td>
    </tr>
    <tr>
      <td>Tech Debt</td>
      <td>debt/*</td>
      <td>Always branch off  Staging|Develop </td>
    </tr>
    <tr>
      <td>Test</td>
      <td>test/*</td>
      <td>Always branch off  Staging | Develop </td>
    </tr>
  </tbody>
</table>

- feature/{name of feature} contains code for features.
- fix/{name of issue} contains code for bug fixes. 
- hotfix/{name of hotfix} contains code for fixing production 
- debt/{name of tech deb} contains code for any Tech Investments
- test/{name of test related code } contains everything test related to our test automation infrastructure, test dependencies.