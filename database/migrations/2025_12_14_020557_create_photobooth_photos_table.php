<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('photobooth_photos', function (Blueprint $table) {
            $table->id();

            $table->foreignId('photobooth_session_id')
                  ->constrained()
                  ->cascadeOnDelete();

            $table->unsignedTinyInteger('frame');
            $table->string('image_path');

            $table->timestamps();

            $table->unique(['photobooth_session_id', 'frame']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('photobooth_photos');
    }
};
