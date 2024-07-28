import React from "react";

const Sidebar = () => {
    return (
        <aside id="leftsidebar" className="sidebar bg-light">
            <div className="d-flex flex-column align-items-start p-3">
                {/* User Info */}
                <div className="d-flex align-items-center mb-4">
                    <div className="me-3">
                        <img
                            src="assets/images/sm/avatar1.jpg"
                            alt="profile img"
                            className="rounded-circle"
                            style={{width: "50px", height: "50px"}}
                        />
                    </div>
                    <div>
                        <span className="d-block">Bienvenido</span>
                        <h5 className="mb-2">John Smith</h5>
                        <ul className="list-unstyled d-flex">
                            <li className="me-2">
                                <a title="Go to Inbox" href="mail-inbox.html">
                                    <i className="bi bi-envelope"></i>
                                </a>
                            </li>
                            <li className="me-2">
                                <a title="Go to Profile" href="profile.html">
                                    <i className="bi bi-person"></i>
                                </a>
                            </li>
                            <li>
                                <a title="Full Screen" href="sign-in.html">
                                    <i className="bi bi-box-arrow-in-right"></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                {/* #User Info */}

                {/* Menu */}
                <ul className="nav flex-column">
                    <li className="nav-item mb-2">
                        <span className="nav-link text-muted">MAIN NAVIGATION</span>
                    </li>

                    {/* AdminX Menu */}
                    <li className="nav-item">
                        <a
                            className="nav-link collapsed"
                            data-bs-toggle="collapse"
                            href="#adminXMenu"
                            role="button"
                            aria-expanded="false"
                            aria-controls="adminXMenu">
                            <i className="bi bi-house-door"></i>
                            <span className="ms-2">adminX</span>
                        </a>
                        <ul className="collapse nav flex-column ms-3" id="adminXMenu">
                            <li className="nav-item">
                                <a className="nav-link" href="index.html">
                                    Dashboard 1
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="dashboard.html">
                                    Dashboard 2
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="dashboard3.html">
                                    Dashboard 3
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="dashboard-rtl.html">
                                    Dashboard 3 RTL
                                </a>
                            </li>
                        </ul>
                    </li>

                    {/* Widgets Menu */}
                    <li className="nav-item">
                        <a
                            className="nav-link collapsed"
                            data-bs-toggle="collapse"
                            href="#widgetsMenu"
                            role="button"
                            aria-expanded="false"
                            aria-controls="widgetsMenu">
                            <i className="bi bi-star"></i>
                            <span className="ms-2">Widgets</span>
                        </a>
                        <ul className="collapse nav flex-column ms-3" id="widgetsMenu">
                            <li className="nav-item">
                                <a className="nav-link" href="basic.html">
                                    Basic
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="more-widgets.html">
                                    More Widgets
                                </a>
                            </li>
                        </ul>
                    </li>

                    {/* User Interface (UI) Menu */}
                    <li className="nav-item">
                        <a
                            className="nav-link collapsed"
                            data-bs-toggle="collapse"
                            href="#uiMenu"
                            role="button"
                            aria-expanded="false"
                            aria-controls="uiMenu">
                            <i className="bi bi-ui-checks"></i>
                            <span className="ms-2">User Interface (UI)</span>
                        </a>
                        <ul className="collapse nav flex-column ms-3" id="uiMenu">
                            <li className="nav-item">
                                <a className="nav-link" href="typography.html">
                                    Typography
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="helper-classes.html">
                                    Helper Classes
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="alerts.html">
                                    Alerts
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="animations.html">
                                    Animations
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="badges.html">
                                    Badges
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="breadcrumbs.html">
                                    Breadcrumbs
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="buttons.html">
                                    Buttons
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="collapse.html">
                                    Collapse
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="colors.html">
                                    Colors
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="dialogs.html">
                                    Dialogs
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="icons.html">
                                    Icons
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="labels.html">
                                    Labels
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="list-group.html">
                                    List Group
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="media-object.html">
                                    Media Object
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="modals.html">
                                    Modals
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="notifications.html">
                                    Notifications
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="pagination.html">
                                    Pagination
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="preloaders.html">
                                    Preloaders
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="progressbars.html">
                                    Progress Bars
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="range-sliders.html">
                                    Range Sliders
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="sortable-nestable.html">
                                    Sortable & Nestable
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="tabs.html">
                                    Tabs
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="waves.html">
                                    Waves
                                </a>
                            </li>
                        </ul>
                    </li>

                    {/* Tables Menu */}
                    <li className="nav-item">
                        <a
                            className="nav-link collapsed"
                            data-bs-toggle="collapse"
                            href="#tablesMenu"
                            role="button"
                            aria-expanded="false"
                            aria-controls="tablesMenu">
                            <i className="bi bi-table"></i>
                            <span className="ms-2">Tables</span>
                        </a>
                        <ul className="collapse nav flex-column ms-3" id="tablesMenu">
                            <li className="nav-item">
                                <a className="nav-link" href="normal-tables.html">
                                    Normal Tables
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="jquery-datatable.html">
                                    Jquery Datatables
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="editable-table.html">
                                    Editable Tables
                                </a>
                            </li>
                        </ul>
                    </li>

                    {/* Medias Menu */}
                    <li className="nav-item">
                        <a
                            className="nav-link collapsed"
                            data-bs-toggle="collapse"
                            href="#mediasMenu"
                            role="button"
                            aria-expanded="false"
                            aria-controls="mediasMenu">
                            <i className="bi bi-image"></i>
                            <span className="ms-2">Medias</span>
                        </a>
                        <ul className="collapse nav flex-column ms-3" id="mediasMenu">
                            <li className="nav-item">
                                <a className="nav-link" href="image-gallery.html">
                                    Image Gallery
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="carousel.html">
                                    Carousel
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="lightbox.html">
                                    Lightbox
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="video.html">
                                    Video
                                </a>
                            </li>
                        </ul>
                    </li>

                    {/* Charts Menu */}
                    <li className="nav-item">
                        <a
                            className="nav-link collapsed"
                            data-bs-toggle="collapse"
                            href="#chartsMenu"
                            role="button"
                            aria-expanded="false"
                            aria-controls="chartsMenu">
                            <i className="bi bi-bar-chart"></i>
                            <span className="ms-2">Charts</span>
                        </a>
                        <ul className="collapse nav flex-column ms-3" id="chartsMenu">
                            <li className="nav-item">
                                <a className="nav-link" href="chartjs.html">
                                    ChartJS
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="sparkline.html">
                                    Sparkline
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="peity.html">
                                    Peity
                                </a>
                            </li>
                        </ul>
                    </li>

                    {/* Forms Menu */}
                    <li className="nav-item">
                        <a
                            className="nav-link collapsed"
                            data-bs-toggle="collapse"
                            href="#formsMenu"
                            role="button"
                            aria-expanded="false"
                            aria-controls="formsMenu">
                            <i className="bi bi-gear"></i>
                            <span className="ms-2">Forms</span>
                        </a>
                        <ul className="collapse nav flex-column ms-3" id="formsMenu">
                            <li className="nav-item">
                                <a className="nav-link" href="basic-form-elements.html">
                                    Basic Elements
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="advanced-form-elements.html">
                                    Advanced Elements
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="form-validation.html">
                                    Form Validation
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="form-wizard.html">
                                    Form Wizard
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="file-uploads.html">
                                    File Uploads
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="image-cropping.html">
                                    Image Cropping
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="dropify.html">
                                    Dropify
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="form-repeater.html">
                                    Form Repeater
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="select2.html">
                                    Select2
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="bootstrap-tagsinput.html">
                                    Bootstrap Tags Input
                                </a>
                            </li>
                        </ul>
                    </li>

                    {/* Users Menu */}
                    <li className="nav-item">
                        <a
                            className="nav-link collapsed"
                            data-bs-toggle="collapse"
                            href="#usersMenu"
                            role="button"
                            aria-expanded="false"
                            aria-controls="usersMenu">
                            <i className="bi bi-people"></i>
                            <span className="ms-2">Users</span>
                        </a>
                        <ul className="collapse nav flex-column ms-3" id="usersMenu">
                            <li className="nav-item">
                                <a className="nav-link" href="user-list.html">
                                    User List
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="user-profile.html">
                                    User Profile
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="user-groups.html">
                                    User Groups
                                </a>
                            </li>
                        </ul>
                    </li>

                    {/* Calendar Menu */}
                    <li className="nav-item">
                        <a
                            className="nav-link collapsed"
                            data-bs-toggle="collapse"
                            href="#calendarMenu"
                            role="button"
                            aria-expanded="false"
                            aria-controls="calendarMenu">
                            <i className="bi bi-calendar"></i>
                            <span className="ms-2">Calendar</span>
                        </a>
                        <ul className="collapse nav flex-column ms-3" id="calendarMenu">
                            <li className="nav-item">
                                <a className="nav-link" href="calendar.html">
                                    Calendar
                                </a>
                            </li>
                        </ul>
                    </li>

                    {/* Settings Menu */}
                    <li className="nav-item">
                        <a
                            className="nav-link collapsed"
                            data-bs-toggle="collapse"
                            href="#settingsMenu"
                            role="button"
                            aria-expanded="false"
                            aria-controls="settingsMenu">
                            <i className="bi bi-gear"></i>
                            <span className="ms-2">Settings</span>
                        </a>
                        <ul className="collapse nav flex-column ms-3" id="settingsMenu">
                            <li className="nav-item">
                                <a className="nav-link" href="settings.html">
                                    Settings
                                </a>
                            </li>
                        </ul>
                    </li>

                    {/* Help Menu */}
                    <li className="nav-item">
                        <a
                            className="nav-link collapsed"
                            data-bs-toggle="collapse"
                            href="#helpMenu"
                            role="button"
                            aria-expanded="false"
                            aria-controls="helpMenu">
                            <i className="bi bi-info-circle"></i>
                            <span className="ms-2">Help</span>
                        </a>
                        <ul className="collapse nav flex-column ms-3" id="helpMenu">
                            <li className="nav-item">
                                <a className="nav-link" href="faq.html">
                                    FAQ
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="contact.html">
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
                {/* #Menu */}
            </div>
        </aside>
    );
};

export default Sidebar;
