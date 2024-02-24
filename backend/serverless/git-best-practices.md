# Branch Naming Practices

(https://gist.github.com/karmenatwork/e0dbe33e1c553e1a998839737c8c799a)

We have two branches main and develop. 

- **main**: contains code that's currently run in production. When code in the develop branch is ready to be deployed to production, all of the changes should be merged into main and then tagged with a release number. This code will go through a QA environment before being deployed to production.
- **develop**: where development code is pushed, and is the branch where all feature branches are merged into.
  The main branch is considered **_origin/develop_** and it is the main branch where the source code of HEAD always reflects a state with the latest delivered development changes for the next release. As a developer, you will you be branching and merging from develop.

Consider **_origin/main_** to always represent the latest code deployed to production. During day to day development, the main branch will not be interacted with.

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
      <td>Accepts merges from Develop and Hotfixes</td>
    </tr>
    <tr>
      <td>Develop</td>
      <td>developing</td>
      <td>Accepts merges from Features/Issues, Bugfixes and Hotfixes</td>
    </tr>
    <tr>
      <td>Features/Issues</td>
      <td>feature/*</td>
      <td>Always branch off HEAD of Develop </td>
    </tr>
    <tr>
      <td>Bugfixes </td>
      <td>fix/*</td>
      <td>Always branch off Develop </td>
    </tr>
    <tr>
      <td>Hotfix</td>
      <td>hotfix/*</td>
      <td>Always branch off main </td>
    </tr>
    <tr>
      <td>Tech Debt</td>
      <td>debt/*</td>
      <td>Always branch off  Develop </td>
    </tr>
    <tr>
      <td>Test</td>
      <td>test/*</td>
      <td>Always branch off Develop </td>
    </tr>
  </tbody>
</table>

- feature/{name of feature} contains code for features.
- fix/{name of issue} contains code for bug fixes.
- hotfix/{name of hotfix} contains code for fixing production
- debt/{name of tech deb} contains code for any Tech Investments
- test/{name of test related code } contains everything test related to our test automation infrastructure, test dependencies.
