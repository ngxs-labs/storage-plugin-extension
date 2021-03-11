import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: "",
                redirectTo: "package",
                pathMatch: "full",
            },
            {
                path: "package",
                // eslint-disable-next-line @typescript-eslint/tslint/config,@typescript-eslint/explicit-function-return-type
                loadChildren: () => import("./examples/delivery/delivery.module").then((m) => m.DeliveryModule),
            },
        ]),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
