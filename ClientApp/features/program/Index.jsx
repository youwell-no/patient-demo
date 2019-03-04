import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { PageNotFound } from '../../common/components';
import urls from '../../app/urls';

import LoadProgram from './components/LoadProgram';
import ProgramList from './ProgramList';
import Program from './Program';
import Module from './Module';
import Task from './Task';
import Plan from './Plan';
import ScheduledTasks from './ScheduledTasks';
import ProgramContentPage from './ProgramContentPage';

class Index extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Route path={`${urls.inside.program.home}/:programId`} component={LoadProgram} />

                <Switch>
                    <Route exact path={urls.inside.program.home} component={ProgramList} />
                    <Route exact path={urls.inside.programredirect} component={ProgramList} />
                    <Route exact path={`${urls.inside.program.home}/:programId/${urls.inside.program.parts.plan}`} component={Plan} />
                    <Route exact path={`${urls.inside.program.home}/:programId/${urls.inside.program.parts.scheduled}`} component={ScheduledTasks} />
                    <Route exact path={`${urls.inside.program.home}/:programId/${urls.inside.program.parts.contentPage}/:key`} component={ProgramContentPage} />
                    <Route exact path={`${urls.inside.program.home}/:programId/${urls.inside.program.parts.module}/:group/:elementIndex`} component={Module} />
                    <Route exact path={`${urls.inside.program.home}/:programId/:group/:elementIndex/:subIndex?`} component={Task} />
                    <Route exact path={`${urls.inside.program.home}/:programId`} component={Program} />
                    <Route component={PageNotFound} />
                </Switch>
            </React.Fragment>
        );
    }
}

export default Index;
